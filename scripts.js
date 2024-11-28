// Handle Profile Form Submission
const profileForm = document.getElementById('profile-form');
const profileDisplay = document.getElementById('profile-display');
const editButton = document.getElementById('edit-profile');

profileForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const weight = document.getElementById('weight').value;
  const goal = document.getElementById('goal').value;

  // Save to localStorage
  const profileData = { name, age, gender, weight, goal };
  localStorage.setItem('trackFitProfile', JSON.stringify(profileData));

  // Display profile data
  displayProfile(profileData);

  // Hide form and show profile display
  profileForm.classList.add('hidden');
  profileDisplay.classList.remove('hidden');
});

// Display Profile Data
function displayProfile(data) {
  document.getElementById('display-name').textContent = data.name;
  document.getElementById('display-age').textContent = data.age;
  document.getElementById('display-gender').textContent = data.gender;
  document.getElementById('display-weight').textContent = data.weight;
  document.getElementById('display-goal').textContent = data.goal;
}

// Load Profile Data on Page Load
window.addEventListener('load', function () {
  const savedProfile = localStorage.getItem('trackFitProfile');
  if (savedProfile) {
    const profileData = JSON.parse(savedProfile);
    displayProfile(profileData);
    profileForm.classList.add('hidden');
    profileDisplay.classList.remove('hidden');
  }
});

// Handle Edit Button
editButton.addEventListener('click', function () {
  profileForm.classList.remove('hidden');
  profileDisplay.classList.add('hidden');
});
document.getElementById("exercise-category").addEventListener("change", function() {
    const category = this.value;
    const exerciseSelect = document.getElementById("exercise");
  
    // Clear current exercises
    exerciseSelect.innerHTML = "";
  
    // Populate exercises based on category
    let exercises = [];
    if (category === "Legs") {
      exercises = ["Squats", "Lunges", "Leg Press","Leg Curls", "Leg Extensions"];
    } else if (category === "Shoulders") {
      exercises = ["Shoulder Press", "Lateral Raises", "Front Raises"];
    } else if (category === "Biceps") {
      exercises = ["Bicep Curls", "Hammer Curls", "Preacher Curls"];
    } else if (category === "Triceps") {
      exercises = ["Tricep Dips", "Tricep Pushdowns", "Skull Crushers"];
    } else if (category === "Back") {
      exercises = ["Pull-ups", "Lat Pulldowns", "Deadlifts"];
    } else if (category === "Chest") {
      exercises = ["Bench Press", "Chest Fly", "Push-ups"];
    } else if (category === "Stretches") {
      exercises = ["Hamstring Stretch", "Quad Stretch", "Hip Flexor Stretch"];
    }
  
    exercises.forEach(exercise => {
      const option = document.createElement("option");
      option.value = exercise;
      option.textContent = exercise;
      exerciseSelect.appendChild(option);
    });
  });

  
  

// Add Workout to UI
function addWorkoutToList(workout) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${workout.exercise} - ${workout.sets} sets x ${workout.reps} reps @ ${workout.weight || 0} kg</span>
    <button class="delete-button">Delete</button>
  `;
  workoutEntries.appendChild(li);

  // Handle delete button
  li.querySelector('.delete-button').addEventListener('click', function () {
    li.remove();
    deleteWorkoutFromStorage(workout);
  });
}

// Delete Workout from localStorage
function deleteWorkoutFromStorage(workoutToRemove) {
  const savedWorkouts = JSON.parse(localStorage.getItem('trackFitWorkouts')) || [];
  const updatedWorkouts = savedWorkouts.filter(
    (workout) =>
      workout.exercise !== workoutToRemove.exercise ||
      workout.sets !== workoutToRemove.sets ||
      workout.reps !== workoutToRemove.reps ||
      workout.weight !== workoutToRemove.weight
  );
  localStorage.setItem('trackFitWorkouts', JSON.stringify(updatedWorkouts));
}

// Handle Nutrition Form Submission
const nutritionForm = document.getElementById('nutrition-form');
const mealEntries = document.getElementById('meal-entries');
const totalCalories = document.getElementById('total-calories');

nutritionForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  const meal = document.getElementById('meal').value;
  const calories = parseInt(document.getElementById('calories').value);
  const date = document.getElementById('date').value;

  // Create meal object
  const mealData = { meal, calories, date };

  // Save to localStorage
  const savedMeals = JSON.parse(localStorage.getItem('trackFitMeals')) || [];
  savedMeals.push(mealData);
  localStorage.setItem('trackFitMeals', JSON.stringify(savedMeals));

  // Add to UI and update total calories
  addMealToList(mealData);
  updateTotalCalories();

  // Clear form
  nutritionForm.reset();
});

// Load Meals from localStorage
window.addEventListener('load', function () {
  const savedMeals = JSON.parse(localStorage.getItem('trackFitMeals')) || [];
  savedMeals.forEach(addMealToList);
  updateTotalCalories();
});

// Add Meal to UI
function addMealToList(mealData) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${mealData.date} - ${mealData.meal} (${mealData.calories} kcal)</span>
    <button class="delete-meal-button">Delete</button>
  `;
  mealEntries.appendChild(li);

  // Handle delete button
  li.querySelector('.delete-meal-button').addEventListener('click', function () {
    li.remove();
    deleteMealFromStorage(mealData);
    updateTotalCalories();
  });
}

// Delete Meal from localStorage
function deleteMealFromStorage(mealToRemove) {
  const savedMeals = JSON.parse(localStorage.getItem('trackFitMeals')) || [];
  const updatedMeals = savedMeals.filter(
    (meal) =>
      meal.meal !== mealToRemove.meal ||
      meal.calories !== mealToRemove.calories ||
      meal.date !== mealToRemove.date
  );
  localStorage.setItem('trackFitMeals', JSON.stringify(updatedMeals));
}

// Update Total Calories
function updateTotalCalories() {
  const savedMeals = JSON.parse(localStorage.getItem('trackFitMeals')) || [];
  const total = savedMeals.reduce((sum, meal) => sum + meal.calories, 0);
  totalCalories.textContent = total;
}

// Include Chart.js for chart rendering
// Initialize the chart only once
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Dates
    datasets: [
      {
        label: 'Weight (kg)',
        data: [], // Weight data
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Body Fat %',
        data: [], // Body Fat data
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Prevent scaling issues
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  },
});

// Form and table elements
const progressForm = document.getElementById('progress-form');
const progressEntries = document.getElementById('progress-entries');

// Add Progress to Table
function addProgressToTable(progress) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${progress.date}</td>
    <td>${progress.weight}</td>
    <td>${progress.bodyFat}</td>
    <td><button class="delete-progress-button">Delete</button></td>
  `;
  progressEntries.appendChild(tr);

  // Attach delete button functionality
  tr.querySelector('.delete-progress-button').addEventListener('click', function () {
    tr.remove();
    deleteProgressFromStorage(progress);
    updateChart(); // Update the chart after deletion
  });
}

// Update Chart Data
function updateChart() {
  const savedProgress = JSON.parse(localStorage.getItem('trackFitProgress')) || [];

  // Prepare data for the chart
  const labels = savedProgress.map((p) => p.date);
  const weightData = savedProgress.map((p) => p.weight);
  const bodyFatData = savedProgress.map((p) => p.bodyFat);

  console.log('Updating chart with:', { labels, weightData, bodyFatData });

  // Update chart data only if it changes
  progressChart.data.labels = labels;
  progressChart.data.datasets[0].data = weightData;
  progressChart.data.datasets[1].data = bodyFatData;

  progressChart.update();
}

// Save Progress to Local Storage and Update UI
progressForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const weight = parseFloat(document.getElementById('progress-weight').value);
  const bodyFat = parseFloat(document.getElementById('body-fat').value);
  const date = document.getElementById('progress-date').value;

  const progressData = { date, weight, bodyFat };

  // Store progress in localStorage
  const savedProgress = JSON.parse(localStorage.getItem('trackFitProgress')) || [];
  savedProgress.push(progressData);
  localStorage.setItem('trackFitProgress', JSON.stringify(savedProgress));

  addProgressToTable(progressData);
  updateChart();

  progressForm.reset(); // Clear the form
});

// Delete Progress from Local Storage
function deleteProgressFromStorage(progressToRemove) {
  const savedProgress = JSON.parse(localStorage.getItem('trackFitProgress')) || [];
  const updatedProgress = savedProgress.filter(
    (p) =>
      p.date !== progressToRemove.date ||
      p.weight !== progressToRemove.weight ||
      p.bodyFat !== progressToRemove.bodyFat
  );
  localStorage.setItem('trackFitProgress', JSON.stringify(updatedProgress));
}

// Load Data on Page Load
window.addEventListener('load', function () {
  const savedProgress = JSON.parse(localStorage.getItem('trackFitProgress')) || [];
  savedProgress.forEach(addProgressToTable);
  updateChart();
});
