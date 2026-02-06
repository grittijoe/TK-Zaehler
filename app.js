// Application State
let currentLanguage = 'de';
let votes = {
    '-1': 0,  // decreased
    '0': 0,   // same
    '1': 0,   // slightly increased
    '2': 0,   // moderately increased
    '3': 0    // strongly increased
};
let canVote = true;
const VOTE_DELAY = 700; // 0.7 seconds in milliseconds

// DOM Elements
const languageScreen = document.getElementById('language-screen');
const votingScreen = document.getElementById('voting-screen');
const resultsScreen = document.getElementById('results-screen');

const languageBtns = document.querySelectorAll('.language-btn');
const voteButtons = document.querySelectorAll('.vote-btn');
const endVotingBtn = document.getElementById('end-voting-btn');
const totalVotesDisplay = document.getElementById('total-votes');

const newVotingBtn = document.getElementById('new-voting-btn');
const printBtn = document.getElementById('print-btn');

// Formula Images
const formulaImgVoting = document.getElementById('formula-img');
const formulaImgResult = document.getElementById('formula-img-result');

// Initialize
function init() {
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    // Language selection
    languageBtns.forEach(btn => {
        btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
    });

    // Voting buttons
    voteButtons.forEach(btn => {
        btn.addEventListener('click', () => handleVote(btn.dataset.value));
    });

    // End voting button
    endVotingBtn.addEventListener('click', showResults);

    // Results screen buttons
    newVotingBtn.addEventListener('click', resetVoting);
    printBtn.addEventListener('click', () => window.print());
}

// Language Selection
function selectLanguage(lang) {
    currentLanguage = lang;
    
    // Set formula images based on language
    if (lang === 'de') {
        formulaImgVoting.src = 'Teamkraft-Formel.jpg';
        formulaImgResult.src = 'Teamkraft-Formel.jpg';
    } else {
        formulaImgVoting.src = 'Teamkraft-Formel-1024-eng.jpg';
        formulaImgResult.src = 'Teamkraft-Formel-1024-eng.jpg';
    }
    
    // Update all translatable elements
    updateLanguage();
    
    // Show voting screen
    switchScreen(votingScreen);
    
    // Enable voting buttons
    voteButtons.forEach(btn => btn.disabled = false);
}

// Update Language
function updateLanguage() {
    const elements = document.querySelectorAll('[data-de][data-en]');
    elements.forEach(el => {
        const text = currentLanguage === 'de' ? el.dataset.de : el.dataset.en;
        el.textContent = text;
    });
}

// Handle Vote
function handleVote(value) {
    if (!canVote) return;
    
    // Register vote
    votes[value]++;
    
    // Update display
    updateTotalVotes();
    
    // Add animation
    const btn = document.querySelector(`[data-value="${value}"]`);
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 400);
    
    // Enable end voting button if this is the first vote
    if (getTotalVotes() === 1) {
        endVotingBtn.disabled = false;
    }
    
    // Disable voting temporarily
    disableVotingTemporarily();
}

// Disable Voting Temporarily
function disableVotingTemporarily() {
    canVote = false;
    voteButtons.forEach(btn => btn.style.opacity = '0.7');
    
    setTimeout(() => {
        canVote = true;
        voteButtons.forEach(btn => btn.style.opacity = '1');
    }, VOTE_DELAY);
}

// Update Total Votes Display
function updateTotalVotes() {
    const total = getTotalVotes();
    totalVotesDisplay.textContent = total;
    
    // Animate number change
    totalVotesDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        totalVotesDisplay.style.transform = 'scale(1)';
    }, 200);
}

// Get Total Votes
function getTotalVotes() {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
}

// Show Results
function showResults() {
    const total = getTotalVotes();
    
    if (total === 0) return;
    
    // Calculate percentages
    const results = {
        '-1': {
            count: votes['-1'],
            percent: ((votes['-1'] / total) * 100).toFixed(1)
        },
        '0': {
            count: votes['0'],
            percent: ((votes['0'] / total) * 100).toFixed(1)
        },
        '1': {
            count: votes['1'],
            percent: ((votes['1'] / total) * 100).toFixed(1)
        },
        '2': {
            count: votes['2'],
            percent: ((votes['2'] / total) * 100).toFixed(1)
        },
        '3': {
            count: votes['3'],
            percent: ((votes['3'] / total) * 100).toFixed(1)
        }
    };
    
    // Update results display
    document.getElementById('result-total').textContent = total;
    
    // Update individual results
    updateResultCard('down', results['-1']);
    updateResultCard('neutral', results['0']);
    updateResultCard('up-light', results['1']);
    updateResultCard('up-medium', results['2']);
    updateResultCard('up-strong', results['3']);
    
    // Switch to results screen
    switchScreen(resultsScreen);
}

// Update Result Card
function updateResultCard(type, data) {
    document.getElementById(`count-${type}`).textContent = data.count;
    document.getElementById(`percent-${type}`).textContent = `${data.percent}%`;
    
    const barFill = document.getElementById(`bar-${type}`);
    // Trigger reflow to restart animation
    barFill.style.width = '0%';
    barFill.offsetHeight; // Force reflow
    setTimeout(() => {
        barFill.style.width = `${data.percent}%`;
    }, 100);
}

// Reset Voting
function resetVoting() {
    // Reset votes
    votes = {
        '-1': 0,
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0
    };
    
    canVote = true;
    
    // Reset displays
    totalVotesDisplay.textContent = '0';
    
    // Disable end voting button
    endVotingBtn.disabled = true;
    
    // Enable voting buttons
    voteButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    // Switch to voting screen
    switchScreen(votingScreen);
}

// Switch Screen
function switchScreen(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Show selected screen
    screen.classList.add('active');
    
    // Update language on screen change
    updateLanguage();
}

// Initialize app
init();
