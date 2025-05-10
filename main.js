'use strict';

{
    let count = 0;
    let timeLeft = 10;
    let timerId;
    let calories = 0;

    const countEl = document.getElementById('count');
    const timerEl = document.getElementById('timer');
    const countBtn = document.getElementById('countBtn');
    const startBtn = document.getElementById('startBtn');
    const startBtnSound = document.getElementById('startBtnSound');
    const countBtnSound = document.getElementById('countBtnSound');
    const caloriesEl = document.getElementById('calories');
    const resultSound = document.getElementById('resultSound');
    const resultScreen = document.getElementById('resultScreen');
    const gameScreen = document.getElementById('gameScreen');
    const currentScoreEl = document.getElementById('currentScore');
    const bestScoreEl = document.getElementById('bestScore');
    const currentCaloriesEl = document.getElementById('currentCalories');
    const recordListEl = document.getElementById('recordList');
    const backBtn = document.getElementById('backBtn');

    countBtn.disabled = true;
    resultScreen.style.display = 'none';

    function startGame() {
        count = 0;
        timeLeft = 10;
        calories = 0;
        countEl.textContent = count;
        timerEl.textContent = timeLeft;
        caloriesEl.textContent = calories.toFixed(2);

        startBtnSound.currentTime = 0;
        startBtnSound.volume = 1.0;
        startBtnSound.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });;

        countBtn.disabled = false;
        startBtn.disabled = true;
        startBtn.classList.add('pushed');
        gameScreen.style.display = 'block';
        resultScreen.style.display = 'none';

        timerId = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;

            if (timeLeft === 0) {
                endGame();
            }
        }, 1000);
    }

    function countUp() {
        count++;
        timeLeft = 11;
        calories += 0.42;
        countEl.textContent = count;
        countBtnSound.currentTime = 0;
        countBtnSound.volume = 1.0;
        countBtnSound.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });;
        caloriesEl.textContent = calories.toFixed(2);
    }

    function endGame() {
        resultSound.currentTime = 0;
        resultSound.volume = 1.0;
        resultSound.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });;

        clearInterval(timerId);
        countBtn.disabled = true;
        startBtn.disabled = false;

        const now = new Date();
        const timestamp = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const records = JSON.parse(localStorage.getItem('records')) || [];
        records.push({ score: Number(count), date: timestamp });
        localStorage.setItem('records', JSON.stringify(records));

        showResultScreen(count, records);
    }

    function showResultScreen(current, records) {
        gameScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        currentScoreEl.textContent = current;
        const caloriesResult = current * 0.42;
        currentCaloriesEl.textContent = caloriesResult.toFixed(2);

        const maxScore = Math.max(...records.map(r => Number(r.score)));
        bestScoreEl.textContent = maxScore;

        recordListEl.innerHTML = '';
        records.slice().reverse().forEach((record ,indexReversed) => {
            const index = records.length - 1 - indexReversed;
            const li = document.createElement('li');
            li.textContent = `${record.date} : ${record.score}回`;

            const delBtn = document.createElement('button');
            delBtn.textContent = '削除';
            delBtn.addEventListener('click', () => {
                records.splice(index, 1);
                localStorage.setItem('records', JSON.stringify(records));
                showResultScreen(count, records);
            });

            li.appendChild(delBtn);
            recordListEl.appendChild(li);

        });
    }

    function back() {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        count = 0;
        timeLeft = 10;
        calories = 0;
        countEl.textContent = count;
        timerEl.textContent = timeLeft;
        caloriesEl.textContent = calories.toFixed(2);
        startBtn.classList.remove('pushed');
    }

    startBtn.addEventListener('click', startGame);
    countBtn.addEventListener('click', countUp);
    countBtn.addEventListener('touchstart', countUp);
    backBtn.addEventListener('click', back);
}
