import { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  Home, Activity, Apple, Dumbbell, User, Wifi, BarChart2, MessageSquare,
  Heart, Moon, Droplets, Footprints, ChevronRight, ChevronLeft, ChevronDown,
  ChevronUp, Plus, Minus, X, Check, Settings, Bell, Download, Share2,
  TrendingUp, TrendingDown, Flame, Target, Award, Clock, Play, Pause,
  SkipForward, RefreshCw, Search, Filter, Edit3, Trash2, FileText, FileJson,
  Shield, Star, Calendar, Info, ArrowUp, ArrowDown, Wind, Brain,
  Sun, CloudRain, Battery, Layers, Globe, Lock, AlertCircle, Table
} from "lucide-react";

// ─── DESIGN SYSTEM ───────────────────────────────────────────────
const C = {
  teal: "#00BFA6", tealDark: "#00A693", tealLight: "#E0F7F4",
  purple: "#5E35B1", purpleLight: "#EDE7F6",
  coral: "#FF6F61", coralLight: "#FFF0EF",
  bg: "#F8FAFB", card: "#FFFFFF", border: "#EEF1F4",
  text: "#1A2332", textMid: "#5A6A7A", textLight: "#9AA5B1",
  success: "#22C55E", warning: "#F59E0B", error: "#EF4444",
  dark: "#0F172A", darkCard: "#1E293B", darkBorder: "#334155"
};
const gradTeal   = `linear-gradient(135deg,${C.teal} 0%,#00D4B8 100%)`;
const gradPurple = `linear-gradient(135deg,${C.purple} 0%,#7C3AED 100%)`;
const gradCoral  = `linear-gradient(135deg,${C.coral} 0%,#FF9A8B 100%)`;

// ─── MOCK DATA ────────────────────────────────────────────────────
const FOOD_DB = [
  { id:1, name:"Chicken Breast", serving:"100g", cal:165, p:31, c:0, f:3.6 },
  { id:2, name:"Brown Rice", serving:"100g cooked", cal:112, p:2.6, c:23.5, f:0.9 },
  { id:3, name:"Whole Eggs", serving:"1 large", cal:72, p:6.3, c:0.4, f:4.8 },
  { id:4, name:"Banana", serving:"1 medium", cal:89, p:1.1, c:22.8, f:0.3 },
  { id:5, name:"Broccoli", serving:"100g", cal:34, p:2.8, c:6.6, f:0.4 },
  { id:6, name:"Salmon", serving:"100g", cal:208, p:20, c:0, f:13 },
  { id:7, name:"Greek Yogurt", serving:"170g", cal:100, p:17, c:6, f:0.7 },
  { id:8, name:"Oats", serving:"40g dry", cal:148, p:5.4, c:26.3, f:2.7 },
  { id:9, name:"Almonds", serving:"30g", cal:174, p:6, c:6, f:15 },
  { id:10, name:"Sweet Potato", serving:"100g baked", cal:90, p:2, c:20.7, f:0.1 },
  { id:11, name:"Milk 2%", serving:"240ml", cal:122, p:8.1, c:11.7, f:4.8 },
  { id:12, name:"Avocado", serving:"half", cal:120, p:1.5, c:6.4, f:11 },
  { id:13, name:"Protein Shake", serving:"1 scoop", cal:130, p:25, c:5, f:2.5 },
  { id:14, name:"Peanut Butter", serving:"2 tbsp", cal:191, p:8, c:7, f:16 },
  { id:15, name:"Quinoa", serving:"185g cooked", cal:222, p:8, c:39, f:3.6 },
];

const EXERCISES = [
  { id:1, name:"Barbell Squat", muscle:"Legs", equipment:"Barbell", difficulty:"Intermediate", emoji:"🦵" },
  { id:2, name:"Bench Press", muscle:"Chest", equipment:"Barbell", difficulty:"Intermediate", emoji:"💪" },
  { id:3, name:"Deadlift", muscle:"Back", equipment:"Barbell", difficulty:"Advanced", emoji:"🏋️" },
  { id:4, name:"Pull-ups", muscle:"Back", equipment:"Bodyweight", difficulty:"Intermediate", emoji:"💪" },
  { id:5, name:"Push-ups", muscle:"Chest", equipment:"Bodyweight", difficulty:"Beginner", emoji:"🤸" },
  { id:6, name:"Overhead Press", muscle:"Shoulders", equipment:"Barbell", difficulty:"Intermediate", emoji:"🏋️" },
  { id:7, name:"Lunges", muscle:"Legs", equipment:"Bodyweight", difficulty:"Beginner", emoji:"🦵" },
  { id:8, name:"Plank", muscle:"Core", equipment:"Bodyweight", difficulty:"Beginner", emoji:"🤸" },
  { id:9, name:"Burpees", muscle:"Full Body", equipment:"Bodyweight", difficulty:"Intermediate", emoji:"🔥" },
  { id:10, name:"Mountain Climbers", muscle:"Core", equipment:"Bodyweight", difficulty:"Intermediate", emoji:"⛰️" },
  { id:11, name:"Bicep Curl", muscle:"Arms", equipment:"Dumbbell", difficulty:"Beginner", emoji:"💪" },
  { id:12, name:"Tricep Dip", muscle:"Arms", equipment:"Bodyweight", difficulty:"Intermediate", emoji:"💪" },
];

const INTEGRATIONS = [
  { id:1, name:"Apple Health", icon:"🍎", status:"connected", types:["Steps","Heart Rate","Sleep","Workouts"], sync:"2 min ago", color:"#FF2D55" },
  { id:2, name:"Google Fit", icon:"🏃", status:"connected", types:["Steps","Distance","Calories"], sync:"15 min ago", color:"#4285F4" },
  { id:3, name:"Garmin", icon:"⌚", status:"connected", types:["Workouts","VO2Max","HRV","Training Load"], sync:"1 hr ago", color:"#007CC3" },
  { id:4, name:"Strava", icon:"🚴", status:"connected", types:["Activities","Routes","Segments"], sync:"3 hr ago", color:"#FC4C02" },
  { id:5, name:"Fitbit", icon:"💜", status:"disconnected", types:["Steps","Sleep","HR"], sync:"Never", color:"#00B0B9" },
  { id:6, name:"Whoop", icon:"🔵", status:"connected", types:["HRV","Recovery","Strain"], sync:"30 min ago", color:"#00D4E5" },
];

const STRAVA_ACTIVITIES = [
  { id:1, name:"Morning Run", type:"Run", dist:5.2, time:"28:14", pace:"5:25/km", hr:152, date:"Today 6:30 AM" },
  { id:2, name:"Evening Ride", type:"Ride", dist:15.8, time:"42:30", pace:"22.3 km/h", hr:138, date:"Yesterday 5:45 PM" },
  { id:3, name:"Long Run Sunday", type:"Run", dist:10.4, time:"58:22", pace:"5:37/km", hr:148, date:"Sun 7:00 AM" },
  { id:4, name:"Interval Session", type:"Run", dist:7.1, time:"35:48", pace:"5:02/km", hr:168, date:"Fri 6:15 AM" },
];

const genWeek = () => Array.from({length:7},(_,i)=>({
  day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  steps:6000+Math.floor(Math.random()*6000),
  calories:1800+Math.floor(Math.random()*600),
  sleep:6+Math.random()*2.5,
  hr:58+Math.floor(Math.random()*20),
  weight:77+(Math.random()-.5)*1.5,
}));
const genMonth = () => Array.from({length:30},(_,i)=>({
  day:i+1, steps:7000+Math.floor(Math.random()*5000),
  score:60+Math.floor(Math.random()*35),
  weight:77.5-i*.05+(Math.random()-.5)*.3,
}));

// ─── CONTEXT ─────────────────────────────────────────────────────
const AppCtx = createContext(null);

const defaultState = {
  user:{ name:"Alex Johnson", age:28, height:178, weight:77.2, gender:"Male", blood:"O+", goal:"lose" },
  tracking:{
    today:{ steps:8420, stepsGoal:10000, calories:2180, caloriesGoal:2400, water:6, waterGoal:8, sleep:7.2, hr:64, bp:"118/76", spo2:98, weight:77.2, mood:7, stress:4, meditation:10 },
    week:genWeek(), month:genMonth(),
  },
  nutrition:{
    goal:{ calories:2200, protein:160, carbs:220, fat:73 },
    meals:{
      breakfast:[{id:1,food:FOOD_DB[2],qty:3},{id:2,food:FOOD_DB[7],qty:1}],
      lunch:[{id:3,food:FOOD_DB[0],qty:1.5},{id:4,food:FOOD_DB[1],qty:1}],
      dinner:[{id:5,food:FOOD_DB[5],qty:1.2},{id:6,food:FOOD_DB[4],qty:1.5}],
      snacks:[{id:7,food:FOOD_DB[3],qty:1},{id:8,food:FOOD_DB[8],qty:1}],
    },
  },
  fitness:{
    history:[
      {id:1,name:"Full Body A",date:"Today",duration:52,calories:380,exercises:6,volume:4200},
      {id:2,name:"HIIT Session",date:"Yesterday",duration:25,calories:310,exercises:5,volume:0},
      {id:3,name:"Upper Body",date:"2 days ago",duration:48,calories:340,exercises:7,volume:5100},
    ],
    prs:[
      {exercise:"Bench Press",weight:90,date:"1 week ago"},
      {exercise:"Squat",weight:110,date:"3 days ago"},
      {exercise:"Deadlift",weight:130,date:"2 weeks ago"},
    ],
  },
  achievements:[
    {id:1,name:"First Workout",icon:"🏆",earned:true,date:"Jan 15"},
    {id:2,name:"7-Day Streak",icon:"🔥",earned:true,date:"Feb 2"},
    {id:3,name:"5K Completed",icon:"🏃",earned:true,date:"Feb 10"},
    {id:4,name:"100 Workouts",icon:"💯",earned:false,progress:67},
    {id:5,name:"Weight Goal",icon:"⚖️",earned:false,progress:45},
    {id:6,name:"30-Day Streak",icon:"📅",earned:false,progress:30},
    {id:7,name:"Early Bird",icon:"🌅",earned:true,date:"Jan 20"},
    {id:8,name:"Hydration Hero",icon:"💧",earned:false,progress:78},
  ],
  goals:[
    {id:1,name:"Lose 5kg",current:77.2,target:72,unit:"kg",type:"weight",deadline:"2025-06-30",onTrack:true},
    {id:2,name:"Run 5K < 25min",current:27.5,target:25,unit:"min",type:"fitness",deadline:"2025-05-01",onTrack:true},
    {id:3,name:"10,000 Daily Steps",current:8420,target:10000,unit:"steps",type:"activity",deadline:"2025-04-01",onTrack:false},
  ],
  stats:{ totalWorkouts:67, totalDays:89, streak:7, longestStreak:14 },
};

function AppProvider({ children }) {
  const [state,setState] = useState(defaultState);
  const update = useCallback((path,value) => {
    setState(prev => {
      const keys = path.split(".");
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length-1; i++) { cur[keys[i]] = {...cur[keys[i]]}; cur = cur[keys[i]]; }
      cur[keys[keys.length-1]] = value;
      return next;
    });
  },[]);
  return <AppCtx.Provider value={{ state, update }}>{children}</AppCtx.Provider>;
}
const useApp = () => useContext(AppCtx);

// ─── UTILS ───────────────────────────────────────────────────────
const bmi = (w,h) => (w/((h/100)**2)).toFixed(1);
const bmr = (w,h,a,g) => g==="Male" ? Math.round(88.36+13.4*w+4.8*h-5.7*a) : Math.round(447.6+9.2*w+3.1*h-4.3*a);
const calcNutrition = meals => {
  let t={cal:0,p:0,c:0,f:0};
  Object.values(meals).flat().forEach(i=>{ t.cal+=i.food.cal*i.qty; t.p+=i.food.p*i.qty; t.c+=i.food.c*i.qty; t.f+=i.food.f*i.qty; });
  return { cal:Math.round(t.cal), p:Math.round(t.p), c:Math.round(t.c), f:Math.round(t.f) };
};
const healthScore = t => {
  const f = Math.min(1,t.steps/t.stepsGoal)*100;
  const n = Math.min(1,t.calories/t.caloriesGoal)*100;
  const s = t.sleep>=7&&t.sleep<=9?100:t.sleep<7?(t.sleep/7)*100:85;
  const v = (t.hr>=60&&t.hr<=100)?100:70;
  return Math.round(.25*f+.25*n+.25*s+.25*v);
};
const zoneColor = s => s>=80?"#22C55E":s>=60?"#EAB308":s>=40?"#F97316":"#EF4444";

// ─── DOWNLOAD ENGINE ─────────────────────────────────────────────
function useDownload(state) {
  const nutr = calcNutrition(state.nutrition.meals);
  const hs = healthScore(state.tracking.today);
  const { user, tracking:{ today, week }, fitness, goals, stats } = state;

  const downloadJSON = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      profile: user,
      todayMetrics: today,
      weeklyData: week,
      nutrition: { today: nutr, goals: state.nutrition.goal },
      fitnessHistory: fitness.history,
      personalRecords: fitness.prs,
      goals,
      stats,
      healthScore: hs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`healthdata_${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows = [
      ["Day","Steps","Calories","Sleep (hrs)","Heart Rate","Weight (kg)"],
      ...week.map(d=>[d.day,d.steps,d.calories,d.sleep.toFixed(1),d.hr,d.weight.toFixed(1)])
    ];
    const mealRows = [["",""],["MEALS",""],["Meal","Food","Qty","Calories","Protein(g)","Carbs(g)","Fat(g)"]];
    Object.entries(state.nutrition.meals).forEach(([meal,items]) => {
      items.forEach(i=>mealRows.push([meal,i.food.name,i.qty,Math.round(i.food.cal*i.qty),Math.round(i.food.p*i.qty),Math.round(i.food.c*i.qty),Math.round(i.food.f*i.qty)]));
    });
    const prRows = [["",""],["PERSONAL RECORDS",""],["Exercise","Weight (kg)","Date"],...fitness.prs.map(p=>[p.exercise,p.weight,p.date])];
    const csv = [...rows,...mealRows,...prRows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`healthdata_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = () => {
    const bmiVal = bmi(user.weight, user.height);
    const bmrVal = bmr(user.weight, user.height, user.age, user.gender);
    const weekAvgSteps = Math.round(week.reduce((s,d)=>s+d.steps,0)/week.length);
    const weekAvgSleep = (week.reduce((s,d)=>s+d.sleep,0)/week.length).toFixed(1);
    const macrosPct = {
      p: Math.round(nutr.p*4/nutr.cal*100)||0,
      c: Math.round(nutr.c*4/nutr.cal*100)||0,
      f: Math.round(nutr.f*9/nutr.cal*100)||0,
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Health Report — ${user.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Outfit',sans-serif;background:#F8FAFB;color:#1A2332;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{max-width:800px;margin:0 auto;padding:40px 32px;}
  .header{background:linear-gradient(135deg,#00BFA6,#00D4B8);border-radius:20px;padding:32px;margin-bottom:28px;color:#fff;}
  .header h1{font-size:32px;font-weight:900;margin-bottom:4px;}
  .header p{opacity:.85;font-size:14px;}
  .score-ring{display:inline-block;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-direction:column;float:right;margin-top:-10px;}
  .score-ring .num{font-size:28px;font-weight:900;line-height:1;}
  .score-ring .lbl{font-size:10px;opacity:.8;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:28px;}
  .grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:28px;}
  .card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #EEF1F4;}
  .card h3{font-size:13px;font-weight:700;color:#5A6A7A;margin-bottom:10px;letter-spacing:.5px;text-transform:uppercase;}
  .stat{font-size:28px;font-weight:900;color:#1A2332;}
  .sub{font-size:12px;color:#9AA5B1;margin-top:2px;}
  .teal{color:#00BFA6;} .coral{color:#FF6F61;} .purple{color:#5E35B1;} .green{color:#22C55E;} .warn{color:#F59E0B;}
  .badge{display:inline-block;background:#E0F7F4;color:#00BFA6;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;}
  .badge.red{background:#FFF0EF;color:#FF6F61;}
  .badge.purple{background:#EDE7F6;color:#5E35B1;}
  .section-title{font-size:18px;font-weight:800;margin-bottom:14px;color:#1A2332;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{background:#F8FAFB;padding:8px 12px;text-align:left;font-weight:700;color:#5A6A7A;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}
  td{padding:8px 12px;border-bottom:1px solid #EEF1F4;color:#1A2332;}
  tr:last-child td{border-bottom:none;}
  .prog-bar{height:8px;background:#EEF1F4;border-radius:4px;overflow:hidden;margin-top:4px;}
  .prog-fill{height:100%;border-radius:4px;}
  .goal-row{padding:12px 0;border-bottom:1px solid #EEF1F4;}
  .goal-row:last-child{border-bottom:none;}
  .pr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .pr-card{background:#F8FAFB;border-radius:12px;padding:14px;text-align:center;}
  .pr-card .val{font-size:22px;font-weight:900;color:#5E35B1;}
  .pr-card .name{font-size:12px;color:#5A6A7A;margin-top:2px;}
  .macro-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #EEF1F4;font-size:14px;}
  .footer{text-align:center;padding:32px 0 8px;color:#9AA5B1;font-size:12px;}
  @media print{
    body{background:#fff;}
    .page{padding:20px;}
    .header{print-color-adjust:exact;}
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="score-ring">
      <span class="num">${hs}</span>
      <span class="lbl">SCORE</span>
    </div>
    <div style="font-size:12px;opacity:.7;margin-bottom:6px;">HEALTH REPORT</div>
    <h1>${user.name}</h1>
    <p>Generated ${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
      <span style="background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">${user.age} yrs · ${user.gender}</span>
      <span style="background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">${user.height}cm · ${user.weight}kg</span>
      <span style="background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">Blood: ${user.blood}</span>
      <span style="background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">Goal: ${user.goal === "lose" ? "Weight Loss" : user.goal === "gain" ? "Muscle Gain" : "Maintenance"}</span>
    </div>
  </div>

  <!-- Body Stats -->
  <p class="section-title">📊 Body Metrics</p>
  <div class="grid4">
    <div class="card"><h3>BMI</h3><div class="stat teal">${bmiVal}</div><div class="sub">${parseFloat(bmiVal)<18.5?"Underweight":parseFloat(bmiVal)<25?"Normal weight":parseFloat(bmiVal)<30?"Overweight":"Obese"}</div></div>
    <div class="card"><h3>BMR</h3><div class="stat">${bmrVal}</div><div class="sub">kcal/day at rest</div></div>
    <div class="card"><h3>TDEE</h3><div class="stat purple">${Math.round(bmrVal*1.55)}</div><div class="sub">Active daily burn</div></div>
    <div class="card"><h3>Weight</h3><div class="stat coral">${user.weight} kg</div><div class="sub">Current</div></div>
  </div>

  <!-- Today's Vitals -->
  <p class="section-title">❤️ Today's Vitals</p>
  <div class="grid4">
    <div class="card"><h3>Heart Rate</h3><div class="stat coral">${today.hr}</div><div class="sub">bpm resting</div></div>
    <div class="card"><h3>Blood Pressure</h3><div class="stat">${today.bp}</div><div class="sub">mmHg</div></div>
    <div class="card"><h3>SpO₂</h3><div class="stat green">${today.spo2}%</div><div class="sub">Blood oxygen</div></div>
    <div class="card"><h3>Steps</h3><div class="stat teal">${today.steps.toLocaleString()}</div><div class="sub">/ ${today.stepsGoal.toLocaleString()} goal</div></div>
  </div>

  <!-- Nutrition -->
  <p class="section-title">🥗 Nutrition Summary</p>
  <div class="grid2" style="margin-bottom:0">
    <div class="card">
      <h3>Today's Calories</h3>
      <div class="stat coral">${nutr.cal} <span style="font-size:16px;font-weight:600;color:#9AA5B1">kcal</span></div>
      <div class="sub">Goal: ${state.nutrition.goal.calories} kcal · ${nutr.cal > state.nutrition.goal.calories ? `<span class="badge red">+${nutr.cal - state.nutrition.goal.calories} over</span>` : `<span class="badge">${state.nutrition.goal.calories - nutr.cal} remaining</span>`}</div>
      <div style="margin-top:12px;">
        <div class="macro-row"><span>Protein</span><span><strong>${nutr.p}g</strong> <span style="color:#9AA5B1">/ ${state.nutrition.goal.protein}g</span></span></div>
        <div class="macro-row"><span>Carbohydrates</span><span><strong>${nutr.c}g</strong> <span style="color:#9AA5B1">/ ${state.nutrition.goal.carbs}g</span></span></div>
        <div class="macro-row" style="border:none"><span>Fats</span><span><strong>${nutr.f}g</strong> <span style="color:#9AA5B1">/ ${state.nutrition.goal.fat}g</span></span></div>
      </div>
    </div>
    <div class="card">
      <h3>Macro Split</h3>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">
        ${[["Protein",nutr.p*4,nutr.cal,"#FF6F61"],["Carbs",nutr.c*4,nutr.cal,"#00BFA6"],["Fat",nutr.f*9,nutr.cal,"#5E35B1"]].map(([l,kcal,tot,col])=>`
        <div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px;"><span>${l}</span><span style="font-weight:700;color:${col}">${Math.round(kcal/tot*100)||0}%</span></div>
          <div class="prog-bar"><div class="prog-fill" style="width:${Math.min(100,Math.round(kcal/tot*100)||0)}%;background:${col};"></div></div>
        </div>`).join("")}
        <div style="margin-top:4px;font-size:12px;color:#9AA5B1;">Water: ${today.water}/${today.waterGoal} glasses</div>
      </div>
    </div>
  </div>
  <br/>

  <!-- Weekly Data Table -->
  <p class="section-title">📅 7-Day Activity Log</p>
  <div class="card" style="margin-bottom:28px;padding:0;overflow:hidden;">
    <table>
      <thead><tr><th>Day</th><th>Steps</th><th>Calories</th><th>Sleep</th><th>Heart Rate</th><th>Weight</th></tr></thead>
      <tbody>
        ${week.map(d=>`<tr>
          <td><strong>${d.day}</strong></td>
          <td>${d.steps.toLocaleString()}</td>
          <td>${d.calories.toLocaleString()} kcal</td>
          <td>${d.sleep.toFixed(1)} hrs</td>
          <td>${d.hr} bpm</td>
          <td>${d.weight.toFixed(1)} kg</td>
        </tr>`).join("")}
        <tr style="background:#F8FAFB;font-weight:700;">
          <td>AVG</td>
          <td>${Math.round(week.reduce((s,d)=>s+d.steps,0)/7).toLocaleString()}</td>
          <td>${Math.round(week.reduce((s,d)=>s+d.calories,0)/7).toLocaleString()} kcal</td>
          <td>${(week.reduce((s,d)=>s+d.sleep,0)/7).toFixed(1)} hrs</td>
          <td>${Math.round(week.reduce((s,d)=>s+d.hr,0)/7)} bpm</td>
          <td>${(week.reduce((s,d)=>s+d.weight,0)/7).toFixed(1)} kg</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Fitness -->
  <p class="section-title">🏋️ Fitness & Strength</p>
  <div class="pr-grid" style="margin-bottom:20px;">
    ${fitness.prs.map(pr=>`<div class="pr-card"><div class="val">${pr.weight}kg</div><div class="name">${pr.exercise}</div><div style="font-size:11px;color:#9AA5B1;margin-top:3px;">${pr.date}</div></div>`).join("")}
  </div>
  <div class="card" style="margin-bottom:28px;padding:0;overflow:hidden;">
    <table>
      <thead><tr><th>Workout</th><th>Date</th><th>Duration</th><th>Calories</th><th>Exercises</th><th>Volume</th></tr></thead>
      <tbody>
        ${fitness.history.map(w=>`<tr>
          <td><strong>${w.name}</strong></td>
          <td>${w.date}</td>
          <td>${w.duration} min</td>
          <td>${w.calories} kcal</td>
          <td>${w.exercises}</td>
          <td>${w.volume > 0 ? w.volume.toLocaleString()+" kg" : "—"}</td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>

  <!-- Goals -->
  <p class="section-title">🎯 Active Goals</p>
  <div class="card" style="margin-bottom:28px;">
    ${goals.map(g=>{
      const prog = g.type==="weight" ? Math.round((1-(g.current-g.target)/(defaultState.user.weight-g.target))*100) : Math.round((g.current/g.target)*100);
      const clamped = Math.min(100, Math.max(0, prog));
      return `<div class="goal-row">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <strong style="font-size:14px;">${g.name}</strong>
          <span class="badge ${g.onTrack?'':'red'}">${g.onTrack?"✅ On Track":"⚠️ Behind"}</span>
        </div>
        <div style="font-size:12px;color:#5A6A7A;margin-bottom:6px;">
          Current: ${g.current} ${g.unit} → Target: ${g.target} ${g.unit} · Deadline: ${g.deadline}
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${clamped}%;background:${g.onTrack?"#00BFA6":"#F59E0B"};"></div></div>
        <div style="font-size:11px;color:#9AA5B1;margin-top:3px;">${clamped}% complete</div>
      </div>`;
    }).join("")}
  </div>

  <!-- Stats Summary -->
  <p class="section-title">🏆 Overall Stats</p>
  <div class="grid4">
    <div class="card" style="text-align:center;"><div class="stat purple">${stats.totalWorkouts}</div><div class="sub">Total Workouts</div></div>
    <div class="card" style="text-align:center;"><div class="stat teal">${stats.totalDays}</div><div class="sub">Active Days</div></div>
    <div class="card" style="text-align:center;"><div class="stat coral">${stats.streak} 🔥</div><div class="sub">Current Streak</div></div>
    <div class="card" style="text-align:center;"><div class="stat green">${stats.longestStreak}</div><div class="sub">Best Streak</div></div>
  </div>

  <div class="footer">
    <p style="font-size:14px;font-weight:700;color:#1A2332;margin-bottom:4px;">UniversalHealth</p>
    <p>This report was auto-generated on ${new Date().toLocaleString()}. Always consult a healthcare professional for medical advice.</p>
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type:"text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`HealthReport_${user.name.replace(" ","_")}_${new Date().toISOString().slice(0,10)}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return { downloadJSON, downloadCSV, downloadReport };
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, borderRadius:16, padding:16, boxShadow:"0 2px 12px rgba(0,0,0,.06)", border:`1px solid ${C.border}`, ...style }}>{children}</div>
);

const ProgressBar = ({ value, max, color, label, unit="" }) => {
  const pct = Math.min(100,(value/max)*100);
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:12, color:C.textMid }}>{label}</span>
        <span style={{ fontSize:12, color:C.text, fontWeight:600 }}>{value}{unit} <span style={{ color:C.textLight }}>/ {max}{unit}</span></span>
      </div>
      <div style={{ height:7, background:`${color}20`, borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:4, transition:"width .5s" }}/>
      </div>
    </div>
  );
};

const Ring = ({ size=80, value=0, max=100, color=C.teal, strokeWidth=8, children }) => {
  const r=(size-strokeWidth*2)/2, circ=2*Math.PI*r, pct=Math.min(1,value/max);
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:"stroke-dashoffset .8s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{children}</div>
    </div>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"flex-end", background:"rgba(0,0,0,.45)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:C.card, borderRadius:"24px 24px 0 0", width:"100%", maxHeight:"85vh", overflow:"auto", padding:24, animation:"slideUp .3s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:18, fontWeight:700, color:C.text }}>{title}</span>
          <button onClick={onClose} style={{ background:`${C.border}80`, border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={16} color={C.textMid}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Btn = ({ children, onClick, color=C.teal, outline=false, small=false, full=false, disabled=false, icon }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background:outline?"transparent":color, border:outline?`2px solid ${color}`:"none",
    color:outline?color:"#fff", borderRadius:12, padding:small?"8px 14px":"12px 20px",
    fontSize:small?13:15, fontWeight:600, cursor:disabled?"not-allowed":"pointer",
    opacity:disabled?.5:1, width:full?"100%":"auto", transition:"all .15s", fontFamily:"inherit",
    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  }}>{icon}{children}</button>
);

const Tag = ({ label, color=C.teal }) => (
  <span style={{ background:`${color}15`, color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{label}</span>
);

const Pill = ({ label, value, color, icon, total }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
    <div style={{ width:56, height:56, borderRadius:"50%", background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, position:"relative" }}>
      {icon}
      <svg style={{ position:"absolute", top:0, left:0 }} width={56} height={56}>
        <circle cx={28} cy={28} r={24} fill="none" stroke={`${color}20`} strokeWidth={3}/>
        <circle cx={28} cy={28} r={24} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${2*Math.PI*24}`} strokeDashoffset={`${2*Math.PI*24*(1-(value/(total||100)))}`}
          strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition:"all .6s" }}/>
      </svg>
    </div>
    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{value}</span>
    <span style={{ fontSize:11, color:C.textLight }}>{label}</span>
  </div>
);

// ─── EXPORT MODAL ────────────────────────────────────────────────
function ExportModal({ open, onClose }) {
  const { state } = useApp();
  const { downloadJSON, downloadCSV, downloadReport } = useDownload(state);
  const [done, setDone] = useState(null);

  const handle = (fn, label) => { fn(); setDone(label); setTimeout(()=>setDone(null),2200); };

  const options = [
    {
      label:"Health Report",
      desc:"Beautiful printable HTML report with all stats, charts and tables",
      icon:<FileText size={22} color={C.teal}/>,
      badge:"Recommended",
      badgeColor:C.teal,
      fn:()=>handle(downloadReport,"report"),
      key:"report",
    },
    {
      label:"CSV Spreadsheet",
      desc:"Weekly data, meals, and personal records in a spreadsheet-ready format",
      icon:<Table size={22} color={C.purple}/>,
      badge:"Excel / Sheets",
      badgeColor:C.purple,
      fn:()=>handle(downloadCSV,"csv"),
      key:"csv",
    },
    {
      label:"JSON Data",
      desc:"Full raw data export — ideal for developers or backup purposes",
      icon:<FileJson size={22} color={C.coral}/>,
      badge:"Dev / Backup",
      badgeColor:C.coral,
      fn:()=>handle(downloadJSON,"json"),
      key:"json",
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Download Your Data">
      <p style={{ fontSize:13, color:C.textMid, margin:"0 0 18px" }}>Choose a format to export your complete health data snapshot.</p>
      {options.map(o => (
        <button key={o.key} onClick={o.fn} style={{
          width:"100%", background:done===o.key?`${C.success}12`:C.bg,
          border:`2px solid ${done===o.key?C.success:C.border}`,
          borderRadius:14, padding:"14px 16px", cursor:"pointer", marginBottom:10,
          display:"flex", alignItems:"center", gap:14, textAlign:"left",
          transition:"all .2s", fontFamily:"inherit"
        }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.card, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.08)", flexShrink:0 }}>
            {done===o.key ? <Check size={22} color={C.success}/> : o.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <span style={{ fontSize:15, fontWeight:700, color:done===o.key?C.success:C.text }}>{done===o.key?"Downloaded!":o.label}</span>
              <Tag label={o.badge} color={o.badgeColor}/>
            </div>
            <p style={{ margin:0, fontSize:12, color:C.textMid, lineHeight:1.4 }}>{o.desc}</p>
          </div>
          {done!==o.key && <Download size={16} color={C.textLight}/>}
        </button>
      ))}
      <div style={{ background:C.tealLight, borderRadius:12, padding:"10px 14px", marginTop:4 }}>
        <p style={{ margin:0, fontSize:12, color:C.teal }}>💡 <strong>Tip:</strong> The HTML report can be opened in any browser and printed as a PDF using Ctrl+P / ⌘+P.</p>
      </div>
    </Modal>
  );
}

// ─── DIGITAL TWIN ────────────────────────────────────────────────
function DigitalTwin({ scores, onZone }) {
  const zones = [
    {id:"head",cx:110,cy:55,r:28},{id:"heart",cx:110,cy:120,r:22},
    {id:"core",cx:110,cy:175,r:26},{id:"legs",cx:110,cy:250,r:20},{id:"arms",cx:110,cy:210,r:16},
  ];
  return (
    <svg width={220} height={310} style={{ filter:"drop-shadow(0 8px 24px rgba(0,191,166,.2))" }}>
      <defs>
        <radialGradient id="bg2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E0F7F4"/><stop offset="100%" stopColor="#B2EBE7"/>
        </radialGradient>
      </defs>
      <ellipse cx={110} cy={55} rx={28} ry={28} fill="url(#bg2)" stroke={zoneColor(scores.head)} strokeWidth={3} opacity={.9}/>
      <rect x={82} y={85} width={56} height={110} rx={12} fill="url(#bg2)" stroke={zoneColor(scores.core)} strokeWidth={2} opacity={.85}/>
      <ellipse cx={68} cy={125} rx={16} ry={40} fill="url(#bg2)" stroke={zoneColor(scores.arms)} strokeWidth={2} opacity={.8}/>
      <ellipse cx={152} cy={125} rx={16} ry={40} fill="url(#bg2)" stroke={zoneColor(scores.arms)} strokeWidth={2} opacity={.8}/>
      <rect x={82} y={195} width={22} height={80} rx={10} fill="url(#bg2)" stroke={zoneColor(scores.legs)} strokeWidth={2} opacity={.85}/>
      <rect x={116} y={195} width={22} height={80} rx={10} fill="url(#bg2)" stroke={zoneColor(scores.legs)} strokeWidth={2} opacity={.85}/>
      <circle cx={110} cy={120} r={8} fill={`${zoneColor(scores.heart)}60`} opacity={.8}>
        <animate attributeName="r" values="8;11;8" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".8;.4;.8" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={110} cy={120} r={5} fill={zoneColor(scores.heart)}/>
      {zones.map(z=>(
        <circle key={z.id} cx={z.cx} cy={z.cy} r={z.r} fill="transparent" style={{ cursor:"pointer" }} onClick={()=>onZone(z.id)}/>
      ))}
      <text x={110} y={163} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text} fontFamily="sans-serif">{scores.core}%</text>
    </svg>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────
function HomeScreen({ onDownload }) {
  const { state } = useApp();
  const { tracking:{ today }, user, stats } = state;
  const [zoneModal, setZoneModal] = useState(null);
  const [insightIdx, setInsightIdx] = useState(0);
  const hs = healthScore(today);
  const nutr = calcNutrition(state.nutrition.meals);
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const scores = {
    head:Math.round((today.mood/10)*100),
    heart:today.hr>=60&&today.hr<=100?88:65,
    core:Math.round(Math.min(100,(nutr.cal/state.nutrition.goal.calories)*100)),
    legs:Math.round((today.steps/today.stepsGoal)*100),
    arms:72,
  };

  const zoneInfo = {
    head:{label:"Mental Health",metrics:[["Mood",`${today.mood}/10`],["Stress",`${today.stress}/10`],["Meditation",`${today.meditation} min`]],tip:"Your mental state looks good! Consider a 5-min breathing exercise."},
    heart:{label:"Cardio Health",metrics:[["Heart Rate",`${today.hr} bpm`],["Blood Pressure",today.bp],["SpO₂",`${today.spo2}%`]],tip:"Resting HR in healthy range. Great cardiovascular fitness!"},
    core:{label:"Nutrition",metrics:[["Calories",`${nutr.cal} kcal`],["Protein",`${nutr.p}g`],["Water",`${today.water}/${today.waterGoal} glasses`]],tip:"Hit your protein goal today. Consider adding more vegetables."},
    legs:{label:"Activity",metrics:[["Steps",today.steps.toLocaleString()],["Goal",today.stepsGoal.toLocaleString()],["Progress",`${Math.round(today.steps/today.stepsGoal*100)}%`]],tip:"You're 80% to your step goal. A short walk will get you there!"},
    arms:{label:"Strength",metrics:[["Bench PR","90 kg"],["Squat PR","110 kg"],["Last Workout","Today"]],tip:"Strength improving steadily. Try progressive overload this week."},
  };

  const insights = [
    "💡 Sleep improved by 0.8h this week — keep it up!",
    "🔥 Step goal hit 5/7 days. Solid consistency!",
    "🥗 Protein intake 15% below target. Add a post-workout shake.",
    "⚡ Recovery score: 78/100. Good to go for high-intensity today!",
  ];

  return (
    <div style={{ padding:"0 16px 100px" }}>
      <div style={{ padding:"20px 0 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontSize:13, color:C.textMid, margin:0 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:"4px 0 0" }}>{greeting}, {user.name.split(" ")[0]}! 👋</h2>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Tag label={`🔥 ${stats.streak} streak`} color={C.coral}/>
          <button onClick={onDownload} style={{ background:gradTeal, border:"none", borderRadius:12, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,191,166,.4)" }}>
            <Download size={16} color="#fff"/>
          </button>
        </div>
      </div>

      {/* Health Score + Twin */}
      <Card style={{ background:gradTeal, padding:20, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:12, margin:0, fontWeight:600 }}>HEALTH SCORE</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:4, margin:"6px 0" }}>
              <span style={{ fontSize:52, fontWeight:900, color:"#fff", lineHeight:1 }}>{hs}</span>
              <span style={{ fontSize:18, color:"rgba(255,255,255,.7)", fontWeight:600 }}>/100</span>
            </div>
            <p style={{ color:"rgba(255,255,255,.9)", fontSize:13, margin:0 }}>
              {hs>=80?"🌟 Excellent":hs>=60?"✅ Good":hs>=40?"⚠️ Fair":"❌ Needs attention"}
            </p>
            <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
              {Object.entries(scores).map(([k,v])=>(
                <button key={k} onClick={()=>setZoneModal(k)} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:8, padding:"4px 8px", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  {{"head":"🧠","heart":"❤️","core":"🥗","legs":"🦵","arms":"💪"}[k]} {v}%
                </button>
              ))}
            </div>
          </div>
          <DigitalTwin scores={scores} onZone={setZoneModal}/>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          <Pill label="Steps" value={today.steps.toLocaleString()} color={C.teal} icon="👣" total={today.stepsGoal}/>
          <Pill label="Calories" value={nutr.cal} color={C.coral} icon="🔥" total={today.caloriesGoal}/>
          <Pill label="Water" value={`${today.water}/${today.waterGoal}`} color={C.purple} icon="💧" total={today.waterGoal}/>
          <Pill label="Sleep" value={`${today.sleep}h`} color={C.success} icon="😴" total={9}/>
        </div>
      </Card>

      {/* Insight Ticker */}
      <Card style={{ background:C.purpleLight, marginBottom:16, cursor:"pointer" }} onClick={()=>setInsightIdx((insightIdx+1)%insights.length)}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:22 }}>🤖</div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:11, color:C.purple, fontWeight:700, margin:"0 0 3px" }}>AI INSIGHT · tap for more</p>
            <p style={{ fontSize:14, color:C.text, margin:0, lineHeight:1.5 }}>{insights[insightIdx]}</p>
          </div>
          <ChevronRight size={16} color={C.purple}/>
        </div>
      </Card>

      {/* Progress */}
      <Card style={{ marginBottom:16 }}>
        <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 12px" }}>Today's Progress</p>
        <ProgressBar value={today.steps} max={today.stepsGoal} color={C.teal} label="Steps"/>
        <ProgressBar value={nutr.cal} max={today.caloriesGoal} color={C.coral} label="Calories" unit=" kcal"/>
        <ProgressBar value={today.water} max={today.waterGoal} color={C.purple} label="Water" unit=" glasses"/>
        <ProgressBar value={today.sleep} max={8} color={C.success} label="Sleep" unit=" hrs"/>
      </Card>

      {/* Zone Detail Modal */}
      <Modal open={!!zoneModal} onClose={()=>setZoneModal(null)} title={zoneModal?zoneInfo[zoneModal]?.label:""}>
        {zoneModal&&(()=>{
          const info=zoneInfo[zoneModal], score=scores[zoneModal];
          return (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <Ring size={60} value={score} max={100} color={zoneColor(score)} strokeWidth={6}>
                  <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{score}%</span>
                </Ring>
                <div><p style={{ margin:0, fontSize:14, fontWeight:700, color:C.text }}>{info.label}</p><Tag label={score>=80?"Excellent":score>=60?"Good":"Needs Work"} color={zoneColor(score)}/></div>
              </div>
              {info.metrics.map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.textMid, fontSize:14 }}>{l}</span>
                  <span style={{ color:C.text, fontSize:14, fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ background:C.tealLight, borderRadius:12, padding:12, marginTop:12 }}>
                <p style={{ margin:0, fontSize:13, color:C.text, lineHeight:1.6 }}>💡 {info.tip}</p>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

// ─── TRACKING SCREEN ─────────────────────────────────────────────
function TrackingScreen() {
  const { state, update } = useApp();
  const { today } = state.tracking;
  const [expanded, setExpanded] = useState("vitals");
  const [logModal, setLogModal] = useState(null);
  const [logVal, setLogVal] = useState("");

  const sections = [
    {id:"vitals",label:"❤️ Vital Signs"},{id:"physical",label:"⚖️ Physical"},
    {id:"activity",label:"🏃 Activity"},{id:"sleep",label:"😴 Sleep"},{id:"mental",label:"🧠 Mental"},
  ];

  const hrData = state.tracking.week.map(d=>({day:d.day,hr:d.hr}));
  const stepsData = state.tracking.week.map(d=>({day:d.day,steps:d.steps}));
  const sleepData = state.tracking.week.map(d=>({day:d.day,sleep:d.sleep}));
  const weightData = state.tracking.week.map(d=>({day:d.day,weight:d.weight}));

  const handleLog = () => {
    if (!logVal||!logModal) return;
    update(`tracking.today.${logModal}`, parseFloat(logVal));
    setLogModal(null); setLogVal("");
  };

  const MetricRow = ({ label, value, unit, fieldKey, trend }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:14, color:C.textMid }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:16, fontWeight:700, color:C.text }}>{value}<span style={{ fontSize:12, color:C.textLight }}> {unit}</span></span>
        {trend==="up"?<TrendingUp size={13} color={C.success}/>:trend==="down"?<TrendingDown size={13} color={C.error}/>:null}
        {fieldKey&&<button onClick={()=>setLogModal(fieldKey)} style={{ background:C.tealLight, border:"none", borderRadius:8, padding:"4px 8px", color:C.teal, fontSize:12, fontWeight:600, cursor:"pointer" }}>Log</button>}
      </div>
    </div>
  );

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:"0 0 16px" }}>Health Tracking</h2>
      <Card style={{ marginBottom:16, padding:"10px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button style={{ background:"none", border:"none", cursor:"pointer" }}><ChevronLeft size={20} color={C.textMid}/></button>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
          <button style={{ background:"none", border:"none", cursor:"pointer" }}><ChevronRight size={20} color={C.textMid}/></button>
        </div>
      </Card>

      {sections.map(s => (
        <Card key={s.id} style={{ marginBottom:12, padding:"0 16px" }}>
          <button onClick={()=>setExpanded(expanded===s.id?null:s.id)}
            style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"inherit" }}>
            <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{s.label}</span>
            {expanded===s.id?<ChevronUp size={18} color={C.textMid}/>:<ChevronDown size={18} color={C.textMid}/>}
          </button>
          {expanded===s.id&&(
            <div style={{ paddingBottom:16 }}>
              {s.id==="vitals"&&<>
                <MetricRow label="Heart Rate" value={today.hr} unit="bpm" fieldKey="hr" trend="down"/>
                <MetricRow label="Blood Pressure" value={today.bp} unit="mmHg"/>
                <MetricRow label="SpO₂" value={today.spo2} unit="%"/>
                <div style={{ marginTop:12 }}>
                  <p style={{ fontSize:12, color:C.textMid, margin:"0 0 8px" }}>Heart Rate — 7 days</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={hrData}><XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                      <Line type="monotone" dataKey="hr" stroke={C.coral} strokeWidth={2} dot={false}/>
                      <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>}
              {s.id==="physical"&&<>
                <MetricRow label="Weight" value={today.weight} unit="kg" fieldKey="weight" trend="down"/>
                <MetricRow label="BMI" value={bmi(today.weight,state.user.height)} unit=""/>
                <div style={{ marginTop:12 }}>
                  <p style={{ fontSize:12, color:C.textMid, margin:"0 0 8px" }}>Weight Trend</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={weightData}><XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                      <Line type="monotone" dataKey="weight" stroke={C.purple} strokeWidth={2} dot={false}/>
                      <Tooltip contentStyle={{borderRadius:8}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>}
              {s.id==="activity"&&<>
                <MetricRow label="Steps" value={today.steps.toLocaleString()} unit="" fieldKey="steps" trend="up"/>
                <MetricRow label="Active Minutes" value={42} unit="min"/>
                <div style={{ marginTop:12 }}>
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={stepsData}><XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                      <Bar dataKey="steps" fill={C.teal} radius={[4,4,0,0]}/>
                      <Tooltip contentStyle={{borderRadius:8}}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>}
              {s.id==="sleep"&&<>
                <MetricRow label="Duration" value={today.sleep} unit="hrs" fieldKey="sleep" trend="up"/>
                <MetricRow label="Quality" value={82} unit="%"/>
                <div style={{ marginTop:12 }}>
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={sleepData}><XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                      <Bar dataKey="sleep" fill={C.success} radius={[4,4,0,0]}/>
                      <Tooltip contentStyle={{borderRadius:8}}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>}
              {s.id==="mental"&&<>
                <MetricRow label="Mood" value={`${today.mood}/10`} unit="" fieldKey="mood" trend="up"/>
                <MetricRow label="Stress" value={`${today.stress}/10`} unit="" fieldKey="stress"/>
                <MetricRow label="Meditation" value={today.meditation} unit="min" fieldKey="meditation"/>
              </>}
            </div>
          )}
        </Card>
      ))}

      <Modal open={!!logModal} onClose={()=>{setLogModal(null);setLogVal("");}} title={`Log ${logModal}`}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <input value={logVal} onChange={e=>setLogVal(e.target.value)} type="number" placeholder="Enter value..."
            style={{ border:`2px solid ${C.border}`, borderRadius:12, padding:"12px 16px", fontSize:18, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box", color:C.text }}/>
          <Btn onClick={handleLog} full>Save</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── NUTRITION SCREEN ────────────────────────────────────────────
function NutritionScreen() {
  const { state, update } = useApp();
  const { nutrition } = state;
  const [addModal, setAddModal] = useState(null);
  const [search, setSearch] = useState("");
  const nutr = calcNutrition(nutrition.meals);
  const remaining = nutrition.goal.calories - nutr.cal;

  const meals = [
    {key:"breakfast",label:"🌅 Breakfast"},{key:"lunch",label:"☀️ Lunch"},
    {key:"dinner",label:"🌙 Dinner"},{key:"snacks",label:"🍎 Snacks"},
  ];

  const addFood = (mealKey, food) => {
    const m = { ...nutrition.meals };
    m[mealKey] = [...m[mealKey], { id:Date.now(), food, qty:1 }];
    update("nutrition.meals", m);
    setAddModal(null); setSearch("");
  };

  const removeFood = (mealKey, itemId) => {
    const m = { ...nutrition.meals };
    m[mealKey] = m[mealKey].filter(i=>i.id!==itemId);
    update("nutrition.meals", m);
  };

  const filtered = FOOD_DB.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:"0 0 16px" }}>Nutrition</h2>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <Ring size={100} value={nutr.cal} max={nutrition.goal.calories} color={C.coral} strokeWidth={10}>
            <div style={{ textAlign:"center" }}><div style={{ fontSize:18, fontWeight:800, color:C.text }}>{nutr.cal}</div><div style={{ fontSize:10, color:C.textLight }}>kcal</div></div>
          </Ring>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ textAlign:"center" }}><p style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>{nutrition.goal.calories}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>goal</p></div>
              <div style={{ textAlign:"center" }}><p style={{ margin:0, fontSize:18, fontWeight:800, color:remaining>0?C.success:C.error }}>{Math.abs(remaining)}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>{remaining>0?"remaining":"over"}</p></div>
            </div>
            <ProgressBar value={nutr.p} max={nutrition.goal.protein} color={C.coral} label="Protein" unit="g"/>
            <ProgressBar value={nutr.c} max={nutrition.goal.carbs} color={C.teal} label="Carbs" unit="g"/>
            <ProgressBar value={nutr.f} max={nutrition.goal.fat} color={C.purple} label="Fat" unit="g"/>
          </div>
        </div>
      </Card>

      {meals.map(meal => {
        const items = nutrition.meals[meal.key]||[];
        const mealCal = items.reduce((s,i)=>s+i.food.cal*i.qty,0);
        return (
          <Card key={meal.key} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{meal.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.textMid }}>{Math.round(mealCal)} kcal</span>
                <button onClick={()=>setAddModal(meal.key)} style={{ background:gradTeal, border:"none", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <Plus size={14} color="#fff"/>
                </button>
              </div>
            </div>
            {items.map(item=>(
              <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderTop:`1px solid ${C.border}` }}>
                <div><p style={{ margin:0, fontSize:13, fontWeight:600, color:C.text }}>{item.food.name}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>P:{Math.round(item.food.p*item.qty)}g C:{Math.round(item.food.c*item.qty)}g F:{Math.round(item.food.f*item.qty)}g</p></div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.textMid }}>{Math.round(item.food.cal*item.qty)}</span>
                  <button onClick={()=>removeFood(meal.key,item.id)} style={{ background:"none", border:"none", cursor:"pointer" }}><Trash2 size={13} color={C.error}/></button>
                </div>
              </div>
            ))}
            {items.length===0&&<p style={{ fontSize:13, color:C.textLight, textAlign:"center", margin:"6px 0" }}>No foods logged yet</p>}
          </Card>
        );
      })}

      {/* Water */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>💧 Water</span>
          <span style={{ fontSize:13, color:C.textMid }}>{state.tracking.today.water}/{state.tracking.today.waterGoal} glasses</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {Array.from({length:state.tracking.today.waterGoal}).map((_,i)=>(
            <div key={i} style={{ width:30, height:38, borderRadius:8, border:`2px solid ${i<state.tracking.today.water?C.purple:C.border}`, background:i<state.tracking.today.water?`${C.purple}20`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💧</div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn small color={C.purple} onClick={()=>update("tracking.today.water",Math.min(state.tracking.today.waterGoal,state.tracking.today.water+1))}>+ Glass</Btn>
          <Btn small outline color={C.purple} onClick={()=>update("tracking.today.water",Math.max(0,state.tracking.today.water-1))}>−</Btn>
        </div>
      </Card>

      <Modal open={!!addModal} onClose={()=>{setAddModal(null);setSearch("");}} title="Add Food">
        <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", background:C.bg, borderRadius:12, padding:"8px 12px" }}>
          <Search size={15} color={C.textLight}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search foods..."
            style={{ border:"none", background:"none", fontSize:14, outline:"none", flex:1, fontFamily:"inherit", color:C.text }}/>
        </div>
        <div style={{ maxHeight:320, overflow:"auto" }}>
          {filtered.map(food=>(
            <div key={food.id} onClick={()=>addModal&&addFood(addModal,food)}
              style={{ display:"flex", justifyContent:"space-between", padding:"10px 4px", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
              <div><p style={{ margin:0, fontSize:14, fontWeight:600, color:C.text }}>{food.name}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>{food.serving}</p></div>
              <div style={{ textAlign:"right" }}>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.coral }}>{food.cal} kcal</p>
                <p style={{ margin:0, fontSize:11, color:C.textLight }}>P:{food.p}g C:{food.c}g F:{food.f}g</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ─── FITNESS SCREEN ───────────────────────────────────────────────
function FitnessScreen() {
  const { state } = useApp();
  const [tab, setTab] = useState("workouts");
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [exModal, setExModal] = useState(null);
  const [completedSets, setCompletedSets] = useState({});
  const [curEx, setCurEx] = useState(0);
  const timerRef = useRef(null);
  const [exFilter, setExFilter] = useState("All");

  useEffect(()=>{
    if(running) timerRef.current=setInterval(()=>setTimer(t=>t+1),1000);
    else clearInterval(timerRef.current);
    return ()=>clearInterval(timerRef.current);
  },[running]);

  const fmtTime = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const muscles=["All","Chest","Back","Legs","Arms","Core","Shoulders","Full Body"];
  const filteredEx=EXERCISES.filter(e=>exFilter==="All"||e.muscle===exFilter);

  const quickStarts=[
    {name:"Full Body",dur:"30 min",cal:280,emoji:"🏋️",color:C.teal},
    {name:"HIIT",dur:"20 min",cal:320,emoji:"🔥",color:C.coral},
    {name:"Core",dur:"15 min",cal:120,emoji:"🎯",color:C.purple},
    {name:"Yoga",dur:"25 min",cal:100,emoji:"🧘",color:C.success},
    {name:"Strength",dur:"45 min",cal:380,emoji:"💪",color:"#8B5CF6"},
    {name:"Stretch",dur:"10 min",cal:50,emoji:"🤸",color:C.warning},
  ];

  if(activeWorkout){
    const exList=activeWorkout.exercises.map(id=>EXERCISES.find(e=>e.id===id)).filter(Boolean);
    return (
      <div style={{ padding:"16px 16px 100px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
          <button onClick={()=>{setActiveWorkout(null);setTimer(0);setRunning(false);}} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={22} color={C.text}/></button>
          <div style={{ flex:1 }}><h3 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>{activeWorkout.name}</h3></div>
          <span style={{ fontSize:22, fontWeight:800, color:C.teal }}>{fmtTime(timer)}</span>
          <button onClick={()=>setRunning(!running)} style={{ background:running?C.coral:C.teal, border:"none", borderRadius:10, padding:"6px 12px", cursor:"pointer" }}>
            {running?<Pause size={16} color="#fff"/>:<Play size={16} color="#fff"/>}
          </button>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
          {exList.map((e,i)=>(
            <button key={e.id} onClick={()=>setCurEx(i)} style={{ background:i===curEx?gradTeal:C.card, border:`2px solid ${i===curEx?C.teal:C.border}`, borderRadius:10, padding:"6px 12px", fontSize:12, fontWeight:700, color:i===curEx?"#fff":C.textMid, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>{i+1}. {e.name}</button>
          ))}
        </div>
        {exList[curEx]&&(
          <Card style={{ marginBottom:14 }}>
            <h3 style={{ margin:"0 0 10px", fontSize:18, fontWeight:800, color:C.text }}>{exList[curEx].emoji} {exList[curEx].name}</h3>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              <Tag label={exList[curEx].muscle} color={C.teal}/>
              <Tag label={exList[curEx].equipment} color={C.purple}/>
              <Tag label={exList[curEx].difficulty} color={C.coral}/>
            </div>
            {[1,2,3].map(set=>{
              const key=`${exList[curEx].id}-${set}`, done=completedSets[key];
              return (
                <div key={set} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderTop:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13, color:C.textMid, width:40 }}>Set {set}</span>
                  <input placeholder="kg" type="number" style={{ width:58, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 8px", fontSize:13, fontFamily:"inherit", color:C.text, outline:"none" }}/>
                  <span style={{ fontSize:12, color:C.textLight }}>×</span>
                  <input placeholder="reps" type="number" style={{ width:58, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 8px", fontSize:13, fontFamily:"inherit", color:C.text, outline:"none" }}/>
                  <button onClick={()=>setCompletedSets({...completedSets,[key]:!done})} style={{ background:done?C.success:C.border, border:"none", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <Check size={13} color={done?"#fff":C.textLight}/>
                  </button>
                </div>
              );
            })}
          </Card>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <Btn outline color={C.teal} onClick={()=>setCurEx(Math.max(0,curEx-1))}>← Prev</Btn>
          <Btn color={C.teal} full onClick={()=>{
            if(curEx<exList.length-1) setCurEx(curEx+1);
            else {setActiveWorkout(null);setTimer(0);setRunning(false);alert("🎉 Workout Complete!");}
          }}>{curEx<exList.length-1?"Next →":"Finish 🎉"}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:"0 0 16px" }}>Fitness</h2>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["workouts","library","history","progress"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?C.teal:C.border, border:"none", borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:700, color:tab===t?"#fff":C.textMid, cursor:"pointer", textTransform:"capitalize", fontFamily:"inherit" }}>{t}</button>
        ))}
      </div>

      {tab==="workouts"&&(
        <>
          <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>Quick Start</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
            {quickStarts.map(w=>(
              <button key={w.name} onClick={()=>{setActiveWorkout({name:w.name,exercises:[1,2,5,8,9]});setTimer(0);setRunning(true);}} style={{ background:C.card, border:`2px solid ${C.border}`, borderRadius:14, padding:"12px 8px", cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                <div style={{ fontSize:24, marginBottom:4 }}>{w.emoji}</div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{w.name}</div>
                <div style={{ fontSize:11, color:C.textLight }}>{w.dur}</div>
              </button>
            ))}
          </div>
          <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>Personal Records</p>
          {state.fitness.prs.map((pr,i)=>(
            <Card key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><p style={{ margin:0, fontSize:14, fontWeight:700, color:C.text }}>{pr.exercise}</p><p style={{ margin:0, fontSize:12, color:C.textLight }}>{pr.date}</p></div>
                <span style={{ fontSize:22, fontWeight:900, color:C.teal }}>{pr.weight} kg</span>
              </div>
            </Card>
          ))}
        </>
      )}

      {tab==="library"&&(
        <>
          <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12, paddingBottom:4 }}>
            {muscles.map(m=>(
              <button key={m} onClick={()=>setExFilter(m)} style={{ background:exFilter===m?C.teal:C.card, border:`1px solid ${exFilter===m?C.teal:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, color:exFilter===m?"#fff":C.textMid, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>{m}</button>
            ))}
          </div>
          {filteredEx.map(ex=>(
            <Card key={ex.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={()=>setExModal(ex)}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:26 }}>{ex.emoji}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.text }}>{ex.name}</p>
                  <div style={{ display:"flex", gap:6, marginTop:4 }}><Tag label={ex.muscle} color={C.teal}/><Tag label={ex.equipment} color={C.purple}/></div>
                </div>
                <Tag label={ex.difficulty} color={ex.difficulty==="Beginner"?C.success:ex.difficulty==="Advanced"?C.error:C.warning}/>
              </div>
            </Card>
          ))}
        </>
      )}

      {tab==="history"&&state.fitness.history.map(w=>(
        <Card key={w.id} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <div><p style={{ margin:0, fontSize:15, fontWeight:700, color:C.text }}>{w.name}</p><p style={{ margin:0, fontSize:12, color:C.textLight }}>{w.date}</p></div>
            <Tag label={`${w.calories} cal`} color={C.coral}/>
          </div>
          <div style={{ display:"flex", gap:20 }}>
            <div><p style={{ margin:0, fontSize:16, fontWeight:800, color:C.teal }}>{w.duration}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>minutes</p></div>
            <div><p style={{ margin:0, fontSize:16, fontWeight:800, color:C.purple }}>{w.exercises}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>exercises</p></div>
            <div><p style={{ margin:0, fontSize:16, fontWeight:800, color:C.coral }}>{w.volume>0?w.volume.toLocaleString():"—"}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>kg vol</p></div>
          </div>
        </Card>
      ))}

      {tab==="progress"&&(
        <Card>
          <p style={{ fontSize:13, fontWeight:700, color:C.textMid, margin:"0 0 10px" }}>WEEKLY VOLUME</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={state.tracking.week.map((d,i)=>({day:d.day,vol:3000+i*400+Math.random()*500}))}>
              <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.teal} stopOpacity={.3}/><stop offset="100%" stopColor={C.teal} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <Area type="monotone" dataKey="vol" stroke={C.teal} fill="url(#vg)" strokeWidth={2}/>
              <Tooltip contentStyle={{borderRadius:8}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Modal open={!!exModal} onClose={()=>setExModal(null)} title={exModal?.name}>
        {exModal&&(
          <div>
            <div style={{ background:`${C.teal}10`, borderRadius:12, height:110, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, fontSize:60 }}>{exModal.emoji}</div>
            <div style={{ display:"flex", gap:6, marginBottom:14 }}><Tag label={exModal.muscle} color={C.teal}/><Tag label={exModal.equipment} color={C.purple}/><Tag label={exModal.difficulty} color={exModal.difficulty==="Beginner"?C.success:C.warning}/></div>
            <div style={{ background:C.tealLight, borderRadius:12, padding:12, marginBottom:14 }}><p style={{ margin:0, fontSize:13, color:C.teal, fontWeight:600 }}>Recommended: 3–4 sets × 8–12 reps</p></div>
            <Btn full color={C.teal} onClick={()=>{setActiveWorkout({name:exModal.name,exercises:[exModal.id]});setTimer(0);setRunning(true);setExModal(null);}}>Start with this Exercise</Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── ANALYTICS SCREEN ────────────────────────────────────────────
function AnalyticsScreen({ onDownload }) {
  const { state } = useApp();
  const [period, setPeriod] = useState("week");
  const { week, month } = state.tracking;

  const yearData = Array.from({length:12},(_,i)=>({
    month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    workouts:8+Math.floor(Math.random()*12),
    steps:7500+Math.floor(Math.random()*4000),
    sleep:7+(Math.random()-.3),
    weight:79-i*.18+(Math.random()-.5)*.5,
  }));

  const gDef = (id,color) => <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={.35}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>;

  const summaries = {
    week:[["Avg Steps","8,240","👣",C.teal],["Workouts","4","🏋️",C.purple],["Avg Sleep","7.4h","😴",C.success],["Avg HR","64 bpm","❤️",C.coral]],
    month:[["Distance","87.4km","🏃",C.teal],["Workouts","18","🏋️",C.purple],["Weight Δ","−1.2kg","⚖️",C.success],["Avg Cal","2,185","🔥",C.coral]],
    year:[["Workouts","147","🏆",C.teal],["Distance","1,240km","🏃",C.purple],["Weight Δ","−4.8kg","⚖️",C.success],["Best Streak","14d","🔥",C.coral]],
    day:[["Steps","8,420","👣",C.teal],["Calories","2,180","🔥",C.coral],["Sleep","7.2h","😴",C.success],["HR","64 bpm","❤️",C.purple]],
  };

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:0 }}>Analytics</h2>
        <button onClick={onDownload} style={{ display:"flex", alignItems:"center", gap:6, background:gradTeal, border:"none", borderRadius:12, padding:"8px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          <Download size={14} color="#fff"/> Export
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:18, background:C.card, borderRadius:14, padding:4, border:`1px solid ${C.border}` }}>
        {["day","week","month","year"].map(p=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{ flex:1, background:period===p?gradTeal:"none", border:"none", borderRadius:10, padding:"8px 4px", fontSize:12, fontWeight:700, color:period===p?"#fff":C.textMid, cursor:"pointer", textTransform:"uppercase", fontFamily:"inherit", transition:"all .2s" }}>{p}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
        {(summaries[period]||[]).map(([l,v,e,c])=>(
          <Card key={l}><p style={{ margin:0, fontSize:22, fontWeight:900, color:C.text }}>{e} {v}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>{l}</p></Card>
        ))}
      </div>

      {period==="week"&&<>
        <Card style={{ marginBottom:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>STEPS THIS WEEK</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={week}><XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/><Bar dataKey="steps" fill={C.teal} radius={[5,5,0,0]}/><Tooltip contentStyle={{borderRadius:8}}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ marginBottom:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>SLEEP & HEART RATE</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={week}>
              <XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="l" tick={{fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="r" orientation="right" tick={{fontSize:9}} axisLine={false} tickLine={false}/>
              <Line yAxisId="l" type="monotone" dataKey="sleep" stroke={C.success} strokeWidth={2} dot={{r:3}} name="Sleep(h)"/>
              <Line yAxisId="r" type="monotone" dataKey="hr" stroke={C.coral} strokeWidth={2} dot={{r:3}} name="HR(bpm)"/>
              <Tooltip contentStyle={{borderRadius:8}}/><Legend iconType="circle" iconSize={8}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>WEIGHT TREND</p>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={week}>{gDef("wg",C.purple)}<XAxis dataKey="day" tick={{fontSize:10}} axisLine={false} tickLine={false}/><Area type="monotone" dataKey="weight" stroke={C.purple} fill="url(#wg)" strokeWidth={2}/><Tooltip contentStyle={{borderRadius:8}}/></AreaChart>
          </ResponsiveContainer>
        </Card>
      </>}

      {period==="month"&&<>
        <Card style={{ marginBottom:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>DAILY HEALTH SCORE</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={month}>{gDef("sg",C.teal)}<XAxis dataKey="day" tick={{fontSize:9}} axisLine={false} tickLine={false} interval={4}/><Area type="monotone" dataKey="score" stroke={C.teal} fill="url(#sg)" strokeWidth={2}/><Tooltip contentStyle={{borderRadius:8}}/></AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>WEIGHT THIS MONTH</p>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={month}><XAxis dataKey="day" tick={{fontSize:9}} axisLine={false} tickLine={false} interval={4}/><Line type="monotone" dataKey="weight" stroke={C.purple} strokeWidth={2} dot={false}/><Tooltip contentStyle={{borderRadius:8}}/></LineChart>
          </ResponsiveContainer>
        </Card>
      </>}

      {period==="year"&&<>
        <Card style={{ marginBottom:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>MONTHLY WORKOUTS</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={yearData}><XAxis dataKey="month" tick={{fontSize:9}} axisLine={false} tickLine={false}/><Bar dataKey="workouts" fill={C.purple} radius={[4,4,0,0]}/><Tooltip contentStyle={{borderRadius:8}}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>ANNUAL WEIGHT JOURNEY</p>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={yearData}>{gDef("wy",C.teal)}<XAxis dataKey="month" tick={{fontSize:9}} axisLine={false} tickLine={false}/><Area type="monotone" dataKey="weight" stroke={C.teal} fill="url(#wy)" strokeWidth={2}/><Tooltip contentStyle={{borderRadius:8}}/></AreaChart>
          </ResponsiveContainer>
        </Card>
      </>}

      {period==="day"&&<>
        <Card style={{ marginBottom:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>HOURLY STEPS</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={Array.from({length:24},(_,i)=>({hour:i,steps:i>=7&&i<=21?Math.floor(Math.random()*800):30}))}>
              <XAxis dataKey="hour" tick={{fontSize:9}} axisLine={false} tickLine={false} interval={3} tickFormatter={h=>`${h}h`}/>
              <Bar dataKey="steps" fill={C.teal} radius={[3,3,0,0]}/><Tooltip contentStyle={{borderRadius:8}}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p style={{ fontSize:12, fontWeight:700, color:C.textMid, margin:"0 0 8px" }}>SLEEP STAGES</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={[{s:"Awake",m:18},{s:"Light",m:145},{s:"Deep",m:88},{s:"REM",m:81}]}>
              <XAxis dataKey="s" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <Bar dataKey="m" radius={[5,5,0,0]}>{["#EF4444","#60A5FA","#6366F1","#A78BFA"].map((c,i)=><Cell key={i} fill={c}/>)}</Bar>
              <Tooltip contentStyle={{borderRadius:8}}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </>}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────
function ProfileScreen({ onDownload }) {
  const { state, update } = useApp();
  const { user, goals, achievements, stats } = state;
  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const [tab, setTab] = useState("profile");

  const bmiVal = bmi(user.weight, user.height);
  const bmrVal = bmr(user.weight, user.height, user.age, user.gender);

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:0 }}>Profile</h2>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onDownload} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Download size={16} color={C.teal}/>
          </button>
          <Btn small outline color={C.teal} onClick={()=>{ if(editing) update("user",editUser); setEditing(!editing); }}>{editing?"Save":"Edit"}</Btn>
        </div>
      </div>

      <Card style={{ background:gradPurple, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{user.gender==="Male"?"👨":"👩"}</div>
          <div style={{ flex:1 }}>
            <h3 style={{ margin:0, color:"#fff", fontSize:18, fontWeight:800 }}>{user.name}</h3>
            <p style={{ margin:0, color:"rgba(255,255,255,.8)", fontSize:13 }}>{user.age} yrs · {user.height}cm · {user.weight}kg</p>
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <Tag label={`BMI ${bmiVal}`} color="rgba(255,255,255,.9)"/>
              <Tag label={`${stats.streak}🔥 streak`} color="rgba(255,255,255,.9)"/>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:14 }}>
          {[["Workouts",stats.totalWorkouts,"🏋️"],["Days",stats.totalDays,"📅"],["Streak",stats.streak,"🔥"],["Best",stats.longestStreak,"🏆"]].map(([l,v,e])=>(
            <div key={l} style={{ textAlign:"center", background:"rgba(255,255,255,.15)", borderRadius:10, padding:"8px 4px" }}>
              <p style={{ margin:0, fontSize:17, fontWeight:800, color:"#fff" }}>{v}</p>
              <p style={{ margin:0, fontSize:10, color:"rgba(255,255,255,.75)" }}>{e} {l}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {["profile","goals","achievements","settings"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1, background:tab===t?C.purple:C.border, border:"none", borderRadius:10, padding:"7px 4px", fontSize:11, fontWeight:700, color:tab===t?"#fff":C.textMid, cursor:"pointer", textTransform:"capitalize", fontFamily:"inherit" }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab==="profile"&&(
        <Card>
          {[["Name","name",user.name],["Age","age",user.age+" yrs"],["Height","height",user.height+" cm"],["Weight","weight",user.weight+" kg"],["Gender","gender",user.gender],["Blood Type","blood",user.blood]].map(([label,key,val])=>(
            <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:14, color:C.textMid }}>{label}</span>
              {editing?<input value={editUser[key]} onChange={e=>setEditUser({...editUser,[key]:e.target.value})} style={{ border:`1px solid ${C.teal}`, borderRadius:8, padding:"4px 8px", fontSize:14, color:C.text, outline:"none", fontFamily:"inherit" }}/>:<span style={{ fontSize:14, fontWeight:600, color:C.text }}>{val}</span>}
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12 }}>
            {[["BMI",bmiVal,parseFloat(bmiVal)<25?"Normal":"Overweight"],["BMR",bmrVal+" kcal","Resting rate"],["TDEE",Math.round(bmrVal*1.55)+" kcal","Active daily"]].map(([l,v,sub])=>(
              <div key={l} style={{ background:C.bg, borderRadius:12, padding:"10px" }}>
                <p style={{ margin:0, fontSize:11, color:C.textMid }}>{l}</p>
                <p style={{ margin:0, fontSize:16, fontWeight:800, color:C.text }}>{v}</p>
                <p style={{ margin:0, fontSize:10, color:C.textLight }}>{sub}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab==="goals"&&<>
        {goals.map(g=>{
          const prog=g.type==="weight"?Math.round((1-(g.current-g.target)/(defaultState.user.weight-g.target))*100):Math.round((g.current/g.target)*100);
          return (
            <Card key={g.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{g.name}</span>
                <Tag label={g.onTrack?"✅ On Track":"⚠️ Behind"} color={g.onTrack?C.success:C.warning}/>
              </div>
              <div style={{ display:"flex", gap:16, marginBottom:10 }}>
                <div><p style={{ margin:0, fontSize:11, color:C.textLight }}>Current</p><p style={{ margin:0, fontSize:16, fontWeight:800, color:C.text }}>{g.current} {g.unit}</p></div>
                <div><p style={{ margin:0, fontSize:11, color:C.textLight }}>Target</p><p style={{ margin:0, fontSize:16, fontWeight:800, color:C.teal }}>{g.target} {g.unit}</p></div>
              </div>
              <ProgressBar value={Math.min(100,Math.max(0,prog))} max={100} color={g.onTrack?C.teal:C.warning} label="Progress" unit="%"/>
            </Card>
          );
        })}
      </>}

      {tab==="achievements"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {achievements.map(a=>(
            <Card key={a.id} style={{ textAlign:"center", opacity:a.earned?1:.55 }}>
              <div style={{ fontSize:34, marginBottom:6 }}>{a.icon}</div>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text }}>{a.name}</p>
              {a.earned?<p style={{ margin:"4px 0 0", fontSize:11, color:C.success }}>✅ {a.date}</p>:<ProgressBar value={a.progress} max={100} color={C.purple} label="" unit="%"/>}
            </Card>
          ))}
        </div>
      )}

      {tab==="settings"&&(
        <Card>
          {[["🔔 Notifications","Push reminders"],["📏 Units","Metric system"],["🌙 Theme","Light mode"],["📤 Export Data","CSV / JSON / Report"],["🔒 Privacy","Data encrypted"],["🗑️ Delete Account","Permanent"]].map(([label,sub],i,arr)=>(
            <div key={label} onClick={label.includes("Export")?onDownload:undefined}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none", cursor:label.includes("Export")?"pointer":"default" }}>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:600, color:label.includes("Delete")?C.error:C.text }}>{label}</p>
                <p style={{ margin:0, fontSize:11, color:C.textLight }}>{sub}</p>
              </div>
              {label.includes("Export")?<Tag label="3 formats" color={C.teal}/>:<ChevronRight size={16} color={C.textLight}/>}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── CONNECT SCREEN ───────────────────────────────────────────────
function ConnectScreen() {
  const [selService, setSelService] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [services, setServices] = useState(INTEGRATIONS);

  const toggle = id => setServices(s=>s.map(svc=>svc.id===id?{...svc,status:svc.status==="connected"?"disconnected":"connected"}:svc));
  const sync = id => { setSyncing(id); setTimeout(()=>setSyncing(null),2000); };
  const sc = s => s==="connected"?C.success:s==="syncing"?C.warning:C.textLight;

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:0 }}>Connect</h2>
        <Btn small color={C.teal} onClick={()=>services.filter(s=>s.status==="connected").forEach(s=>sync(s.id))}>Sync All</Btn>
      </div>

      <Card style={{ background:gradTeal, marginBottom:16 }}>
        <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,.8)", fontSize:12, fontWeight:600 }}>DATA OVERVIEW</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[["🏋️ Workouts","247","Strava + Apple"],["🥗 Nutrition","1,842","MFP + Manual"],["😴 Sleep","365","Apple + Garmin"],["⚖️ Weight","156","Withings + Manual"]].map(([l,v,s])=>(
            <div key={l} style={{ background:"rgba(255,255,255,.2)", borderRadius:12, padding:"10px 12px" }}>
              <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,.8)" }}>{l}</p>
              <p style={{ margin:0, fontSize:20, fontWeight:900, color:"#fff" }}>{v}</p>
              <p style={{ margin:0, fontSize:10, color:"rgba(255,255,255,.7)" }}>{s}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Strava */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>🚴 Recent Activities</span>
          <Tag label="Strava" color="#FC4C02"/>
        </div>
        {STRAVA_ACTIVITIES.map(a=>(
          <div key={a.id} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div><p style={{ margin:0, fontSize:14, fontWeight:700, color:C.text }}>{a.name}</p><p style={{ margin:0, fontSize:11, color:C.textLight }}>{a.date}</p></div>
              <Tag label={a.type} color="#FC4C02"/>
            </div>
            <div style={{ display:"flex", gap:14, marginTop:5 }}>
              <span style={{ fontSize:12, color:C.textMid }}>📏 {a.dist}km</span>
              <span style={{ fontSize:12, color:C.textMid }}>⏱ {a.time}</span>
              <span style={{ fontSize:12, color:C.textMid }}>👟 {a.pace}</span>
              <span style={{ fontSize:12, color:C.textMid }}>❤️ {a.hr}bpm</span>
            </div>
          </div>
        ))}
      </Card>

      <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>Connected Services</p>
      {services.map(svc=>(
        <Card key={svc.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={()=>setSelService(svc)}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${svc.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{svc.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{svc.name}</span>
                <div style={{ width:6, height:6, borderRadius:"50%", background:sc(svc.status) }}/>
                <span style={{ fontSize:11, color:sc(svc.status), fontWeight:600 }}>{syncing===svc.id?"syncing…":svc.status}</span>
              </div>
              <span style={{ fontSize:11, color:C.textLight }}>{svc.types.slice(0,3).join(" · ")}</span>
            </div>
            <button onClick={e=>{e.stopPropagation();toggle(svc.id);}} style={{ background:svc.status==="connected"?`${C.success}15`:C.border, border:"none", borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:700, color:svc.status==="connected"?C.success:C.textMid, cursor:"pointer", fontFamily:"inherit" }}>
              {svc.status==="connected"?"ON":"OFF"}
            </button>
          </div>
        </Card>
      ))}

      <Modal open={!!selService} onClose={()=>setSelService(null)} title={selService?.name}>
        {selService&&(
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`${selService.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{selService.icon}</div>
              <div><p style={{ margin:0, fontWeight:700, color:C.text }}>{selService.name}</p><p style={{ margin:0, fontSize:12, color:C.textLight }}>Last sync: {selService.sync}</p></div>
            </div>
            {selService.types.map(t=>(
              <div key={t} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:14, color:C.text }}>{t}</span><Check size={16} color={C.success}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <Btn full color={C.teal} onClick={()=>{sync(selService.id);setSelService(null);}}>Sync Now</Btn>
              <Btn full outline color={C.error} onClick={()=>{toggle(selService.id);setSelService(null);}}>{selService.status==="connected"?"Disconnect":"Connect"}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── COACH SCREEN ─────────────────────────────────────────────────
function CoachScreen() {
  const { state } = useApp();
  const { tracking:{ today }, stats } = state;
  const nutr = calcNutrition(state.nutrition.meals);
  const hs = healthScore(today);
  const [messages, setMessages] = useState([
    { role:"assistant", text:`Hey ${state.user.name.split(" ")[0]}! 👋 Great 5.2km run this morning — your pace improved by 12 sec/km this week! Sleep was 7.2h (slightly below your 7.8h avg). I recommend moderate intensity today. You're 1,580 steps from your daily goal — a 15-min walk will do it! 💪` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const quickPrompts = ["How am I doing?","Should I work out?","Meal suggestions","Analyze my sleep","Goal check-in"];

  const aiResponse = q => {
    const l = q.toLowerCase();
    if(l.includes("how am i")||l.includes("doing")) return `📊 Your week in review:\n\n• Steps: avg 8,420/day (84% of goal)\n• Workouts: 3/4 planned ✅\n• Nutrition: 92% calorie adherence\n• Sleep: 7.2h avg (below ideal 7.5h+)\n• Resting HR: 64 bpm (excellent!)\n\nOverall score: ${hs}/100. Focus on hitting your sleep goal this week — it'll boost recovery and performance.`;
    if(l.includes("work out")) return `💪 Based on your data:\n\n• Last workout: 1 day ago\n• Sleep last night: ${today.sleep}h ${today.sleep>=7?"✅":"⚠️"}\n• Recovery score: 78/100\n• HRV: 52ms (normal)\n\nRecommendation: YES — moderate intensity. Upper body or 30-min cardio would be ideal. Avoid max effort this week.`;
    if(l.includes("meal")) return `🥗 Based on your ${nutr.cal} kcal today:\n\n• Protein: ${nutr.p}g (${Math.round(nutr.p/state.nutrition.goal.protein*100)}% of goal)\n• Remaining: ${state.nutrition.goal.calories-nutr.cal} kcal\n\nSuggested dinner: Salmon (200g) + Quinoa (185g) + Broccoli (150g) = ~520 kcal, 45g protein. That would nail your protein goal! 🎯`;
    if(l.includes("sleep")) return `😴 Sleep analysis:\n\n• Last 7-day avg: 7.2h\n• Optimal target: 7.5–8.5h\n• Best nights: after workout days (+47 min)\n\nTip: Schedule workouts before 7PM and add a 10-min wind-down routine. Avoiding screens 1hr before bed could add 20–30 min of deep sleep!`;
    if(l.includes("goal")) return `🎯 Goal Update:\n\n1. Lose 5kg — On track (${state.goals[0].current}kg → 72kg)\n2. Run 5K <25min — Improving! (27.5 → 25min in ~6 weeks)\n3. 10k Steps — Behind (8,420 avg). Add a lunch walk!\n\nYou're making solid progress. Small consistent actions compound into big results! 🚀`;
    return `🤖 Great question! Based on your current data (Health Score: ${hs}/100, ${today.steps.toLocaleString()} steps today), you're making solid progress. What specific area would you like to explore? Try asking about workouts, nutrition, sleep, or your goals.`;
  };

  const send = async txt => {
    const msg = txt||input;
    if(!msg.trim()) return;
    setMessages(m=>[...m,{role:"user",text:msg}]);
    setInput(""); setLoading(true);
    await new Promise(r=>setTimeout(r,700+Math.random()*600));
    setMessages(m=>[...m,{role:"assistant",text:aiResponse(msg)}]);
    setLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  const insightCards = [
    {icon:"💪",title:"Strength Trend",body:"Squat plateaued 3 weeks. Try Bulgarian split squats to break through!",color:C.coral},
    {icon:"🏃",title:"Cardio Progress",body:"5K improved 1:23 this month. Sub-25min in ~6 weeks with intervals.",color:C.teal},
    {icon:"🔋",title:"Recovery Status",body:"7-day training load: high (187). Consider a deload week soon.",color:C.warning},
    {icon:"🥗",title:"Nutrition Timing",body:"68% of calories after 6PM. Distribute more evenly for better results.",color:C.purple},
  ];

  return (
    <div style={{ padding:"16px 16px 100px" }}>
      <Card style={{ background:gradPurple, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(255,255,255,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
          <div style={{ flex:1 }}><h3 style={{ margin:0, color:"#fff", fontSize:18, fontWeight:800 }}>Coach Alex</h3><p style={{ margin:0, color:"rgba(255,255,255,.8)", fontSize:12 }}>AI Fitness Coach</p></div>
          <div style={{ textAlign:"right" }}><p style={{ margin:0, color:"#fff", fontSize:22, fontWeight:900 }}>{hs}</p><p style={{ margin:0, color:"rgba(255,255,255,.7)", fontSize:10 }}>HEALTH SCORE</p></div>
        </div>
      </Card>

      {/* Action Items */}
      <Card style={{ marginBottom:16 }}>
        <p style={{ margin:"0 0 10px", fontSize:14, fontWeight:700, color:C.text }}>📋 Today's Actions</p>
        {[{done:true,text:"Morning run 5.2km ✅"},{done:false,text:"Drink 2.5L water (6/8 glasses)"},{done:true,text:"Log breakfast ✅"},{done:false,text:"Evening walk 2,000 steps"},{done:false,text:"Wind down by 10PM"}].map((item,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:22, height:22, borderRadius:6, background:item.done?C.success:C.border, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {item.done&&<Check size={12} color="#fff"/>}
            </div>
            <span style={{ fontSize:14, color:item.done?C.textLight:C.text, textDecoration:item.done?"line-through":"none" }}>{item.text}</span>
          </div>
        ))}
      </Card>

      {/* AI Insights */}
      <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>🧠 AI Insights</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {insightCards.map(c=>(
          <Card key={c.title} style={{ background:`${c.color}08`, border:`1px solid ${c.color}20` }}>
            <div style={{ fontSize:22, marginBottom:5 }}>{c.icon}</div>
            <p style={{ margin:"0 0 3px", fontSize:13, fontWeight:700, color:C.text }}>{c.title}</p>
            <p style={{ margin:0, fontSize:12, color:C.textMid, lineHeight:1.4 }}>{c.body}</p>
          </Card>
        ))}
      </div>

      {/* Chat */}
      <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>💬 Chat</p>
      <Card>
        <div style={{ maxHeight:260, overflowY:"auto", marginBottom:10 }}>
          {messages.map((m,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
              {m.role==="assistant"&&<div style={{ width:26, height:26, borderRadius:"50%", background:C.purpleLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:7, flexShrink:0, alignSelf:"flex-start", marginTop:2 }}>🤖</div>}
              <div style={{ background:m.role==="user"?gradTeal:C.bg, borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 13px", maxWidth:"80%" }}>
                <p style={{ margin:0, fontSize:13, color:m.role==="user"?"#fff":C.text, lineHeight:1.55, whiteSpace:"pre-line" }}>{m.text}</p>
              </div>
            </div>
          ))}
          {loading&&<div style={{ display:"flex", gap:4, padding:"10px 13px", background:C.bg, borderRadius:"16px 16px 16px 4px", width:"fit-content" }}>
            {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.textLight, animation:`pulse ${.8+i*.2}s infinite` }}/>)}
          </div>}
          <div ref={endRef}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {quickPrompts.map(p=>(
            <button key={p} onClick={()=>send(p)} style={{ background:C.tealLight, border:"none", borderRadius:20, padding:"5px 11px", fontSize:12, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>{p}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", background:C.bg, borderRadius:12, padding:"8px 12px" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask me anything..." style={{ border:"none", background:"none", flex:1, fontSize:14, outline:"none", fontFamily:"inherit", color:C.text }}/>
          <button onClick={()=>send()} style={{ background:gradTeal, border:"none", borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><ChevronRight size={15} color="#fff"/></button>
        </div>
      </Card>
    </div>
  );
}

// ─── NAVIGATION ───────────────────────────────────────────────────
const TABS = [
  {id:"home",label:"Home",icon:Home},{id:"tracking",label:"Track",icon:Activity},
  {id:"nutrition",label:"Food",icon:Apple},{id:"fitness",label:"Fit",icon:Dumbbell},
  {id:"profile",label:"Profile",icon:User},{id:"connect",label:"Connect",icon:Wifi},
  {id:"analytics",label:"Stats",icon:BarChart2},{id:"coach",label:"Coach",icon:MessageSquare},
];

// ─── ROOT ─────────────────────────────────────────────────────────
function AppInner() {
  const [activeTab, setActiveTab] = useState("home");
  const [exportOpen, setExportOpen] = useState(false);
  const { state } = useApp();

  const screenProps = { onDownload:()=>setExportOpen(true) };

  const screens = {
    home:<HomeScreen {...screenProps}/>,
    tracking:<TrackingScreen/>,
    nutrition:<NutritionScreen/>,
    fitness:<FitnessScreen/>,
    profile:<ProfileScreen {...screenProps}/>,
    connect:<ConnectScreen/>,
    analytics:<AnalyticsScreen {...screenProps}/>,
    coach:<CoachScreen/>,
  };

  return (
    <div style={{ maxWidth:430, margin:"0 auto", fontFamily:"'Outfit','Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        body{margin:0;background:${C.bg};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.3);opacity:1}}
        button{font-family:'Outfit',sans-serif;}
        input{font-family:'Outfit',sans-serif;}
      `}</style>

      {screens[activeTab]}

      {/* Export Modal */}
      <ExportModal open={exportOpen} onClose={()=>setExportOpen(false)}/>

      {/* FAB Download Button */}
      <button onClick={()=>setExportOpen(true)} title="Download your data"
        style={{ position:"fixed", bottom:90, right:16, width:48, height:48, borderRadius:"50%", background:gradTeal, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,191,166,.5)", zIndex:499, transition:"transform .15s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <Download size={20} color="#fff"/>
      </button>

      {/* Bottom Nav */}
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.card, borderTop:`1px solid ${C.border}`, display:"flex", padding:"6px 0 8px", boxShadow:"0 -4px 20px rgba(0,0,0,.08)", zIndex:500 }}>
        {TABS.map(tab=>{
          const Icon=tab.icon, active=activeTab===tab.id;
          return (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 0", fontFamily:"inherit" }}>
              <div style={{ width:36, height:26, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", background:active?`${C.teal}18`:"none", transition:"all .2s" }}>
                <Icon size={18} color={active?C.teal:C.textLight} strokeWidth={active?2.5:2}/>
              </div>
              <span style={{ fontSize:9, fontWeight:700, color:active?C.teal:C.textLight, letterSpacing:.3 }}>{tab.label.toUpperCase()}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner/></AppProvider>;
}
