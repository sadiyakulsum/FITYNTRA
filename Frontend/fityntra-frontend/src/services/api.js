// ─── FITYNTRA API — connects to your FastAPI backend at port 8000 ─────────────
const BASE = "http://localhost:8000";

// Helper — makes fetch calls and handles errors cleanly
const call = async (method, path, body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(typeof data.detail==="string"?data.detail:JSON.stringify(data.detail)||"API error");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH  →  POST /auth/login
// ─────────────────────────────────────────────────────────────────────────────
// Your backend uses OAuth2 form format for login
export const loginUser = async (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);   // FastAPI OAuth2 uses "username"
  form.append("password", password);
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data; // { access_token, token_type }
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS  →  POST /users/   GET /users/{user_id}   GET /users/email/{email}
// ─────────────────────────────────────────────────────────────────────────────
export const createUser = (userData) =>
  // userData: { name, email, password, age, height_cm, weight_kg, gender, goal, activity_level, dietary_preference }
  call("POST", "/users/", userData);

export const getUserById = (userId, token) =>
  call("GET", `/users/${userId}`, null, token);

export const getUserByEmail = (email, token) =>
  call("GET", `/users/email/${email}`, null, token);

// ─────────────────────────────────────────────────────────────────────────────
// PREDICTIONS  →  /predict/*
// ─────────────────────────────────────────────────────────────────────────────

// Diet prediction — returns meal plan + macros
// body: { user_id, age, height_cm, weight_kg, gender, goal, activity_level, dietary_preference }
export const predictDiet = (body, token) =>
  call("POST", "/predict/diet", body, token);

// Workout prediction — returns weekly workout plan
// body: { user_id, age, height_cm, weight_kg, gender, goal, activity_level, fitness_level, injuries? }
export const predictWorkout = (body, token) =>
  call("POST", "/predict/workout", body, token);

// Fitness level assessment
// body: { user_id, age, weight_kg, height_cm, resting_heart_rate, exercise_frequency }
export const predictFitnessLevel = (body, token) =>
  call("POST", "/predict/fitness-level", body, token);

// Nutrition score — how good is the meal?
// body: { calories, carbs_g, protein_g, fat_g, fiber_g, goal }
export const scoreNutrition = (body, token) =>
  call("POST", "/predict/nutrition-score", body, token);

// Exercise calorie burn estimate
// body: { exercise_type, duration_minutes, weight_kg, intensity }
export const predictExerciseBurn = (body, token) =>
  call("POST", "/predict/exercise-burn", body, token);

// Injury chat — alternative injury endpoint (uses ML)
// body: { user_id, message, session_id? }
export const injuryChat = (body, token) =>
  call("POST", "/predict/injury-chat", body, token);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD LOGGING  →  /log/food
// ─────────────────────────────────────────────────────────────────────────────

// Log a food entry
// body: { user_id, food_name, meal_type, calories, carbs_g, protein_g, fat_g, fiber_g?, date? }
export const logFood = (body, token) =>
  call("POST", "/log/food", body, token);

// Get all food logs for a user
export const getFoodLogs = (userId, token) =>
  call("GET", `/log/food/${userId}`, null, token);

// ─────────────────────────────────────────────────────────────────────────────
// STREAKS  →  /streak/*
// ─────────────────────────────────────────────────────────────────────────────

// Get user's current streak
export const getStreak = (userId, token) =>
  call("GET", `/streak/${userId}`, null, token);

// Check in for today (adds to streak)
export const checkInStreak = (userId, token) =>
  call("POST", `/streak/${userId}/checkin`, {}, token);

// ─────────────────────────────────────────────────────────────────────────────
// REHA COACH  →  /rehab/*
// ─────────────────────────────────────────────────────────────────────────────

// Send a message to REHA chatbot
// body: { user_id, message, session_id? }
export const rehaChat = (body, token) =>
  call("POST", "/rehab/chat", body, token);

// Reset REHA conversation history
// body: { user_id, session_id? }
export const rehaReset = (body, token) =>
  call("POST", "/rehab/reset", body, token);

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK  →  /health   /ml-health
// ─────────────────────────────────────────────────────────────────────────────
export const healthCheck   = () => call("GET", "/health");
export const mlHealthCheck = () => call("GET", "/ml-health");

export const updateUser = (userId, data, token) =>
  call("PUT", `/users/${userId}`, data, token);