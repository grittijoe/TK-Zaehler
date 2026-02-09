// Application State
let currentLanguage = 'de';
let setupData = {
    language: '',
    industry: '',
    country: '',
    product: ''
};
let votes = {
    '-1': 0,  // decreased
    '0': 0,   // same
    '1': 0,   // slightly increased
    '2': 0,   // moderately increased
    '3': 0    // strongly increased
};
let canVote = true;
const VOTE_DELAY = 700; // 0.7 seconds in milliseconds
const CORRECT_PIN = '313';

// DOM Elements
const languageScreen = document.getElementById('language-screen');
const votingScreen = document.getElementById('voting-screen');
const resultsScreen = document.getElementById('results-screen');
const pinModal = document.getElementById('pin-modal');

const setupForm = document.getElementById('setup-form');
const languageBtns = document.querySelectorAll('.language-btn');
const industrySelect = document.getElementById('industry-select');
const countrySelect = document.getElementById('country-select');
const productSelect = document.getElementById('product-select');
const customProductSection = document.getElementById('custom-product-section');
const customProductInput = document.getElementById('custom-product');
const startBtn = document.querySelector('.start-btn');

const voteButtons = document.querySelectorAll('.vote-btn');
const endVotingBtn = document.getElementById('end-voting-btn');
const totalVotesDisplay = document.getElementById('total-votes');

const pinInput = document.getElementById('pin-input');
const pinError = document.getElementById('pin-error');
const pinSubmitBtn = document.getElementById('pin-submit-btn');
const pinCancelBtn = document.getElementById('pin-cancel-btn');

const newVotingBtn = document.getElementById('new-voting-btn');
const downloadBtn = document.getElementById('download-btn');
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
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectLanguageButton(btn.dataset.lang);
        });
    });

    // Product selection change
    productSelect.addEventListener('change', handleProductChange);

    // Setup form submission
    setupForm.addEventListener('submit', handleSetupSubmit);

    // Form validation on change
    industrySelect.addEventListener('change', validateSetupForm);
    countrySelect.addEventListener('change', validateSetupForm);

    // Voting buttons
    voteButtons.forEach(btn => {
        btn.addEventListener('click', () => handleVote(btn.dataset.value));
    });

    // End voting button - show PIN modal
    endVotingBtn.addEventListener('click', showPinModal);

    // PIN modal
    pinSubmitBtn.addEventListener('click', checkPin);
    pinCancelBtn.addEventListener('click', hidePinModal);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPin();
        // Only allow numbers
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    pinInput.addEventListener('input', (e) => {
        // Limit to 3 digits
        if (e.target.value.length > 3) {
            e.target.value = e.target.value.slice(0, 3);
        }
    });

    // Results screen buttons
    newVotingBtn.addEventListener('click', resetVoting);
    downloadBtn.addEventListener('click', downloadResults);
    printBtn.addEventListener('click', () => window.print());
}

// Language Selection
function selectLanguageButton(lang) {
    currentLanguage = lang;
    setupData.language = lang;
    
    // Update button states
    languageBtns.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Update language immediately
    updateLanguage();
    
    // Validate form
    validateSetupForm();
}

// Handle Product Change
function handleProductChange() {
    const selectedProduct = productSelect.value;
    
    if (selectedProduct === 'custom') {
        customProductSection.style.display = 'block';
        customProductInput.required = true;
        customProductInput.focus();
    } else {
        customProductSection.style.display = 'none';
        customProductInput.required = false;
    }
}

// Validate Setup Form
function validateSetupForm() {
    const languageSelected = setupData.language !== '';
    const industrySelected = industrySelect.value !== '';
    const countrySelected = countrySelect.value !== '';
    
    const isValid = languageSelected && industrySelected && countrySelected;
    startBtn.disabled = !isValid;
}

// Handle Setup Form Submission
function handleSetupSubmit(e) {
    e.preventDefault();
    
    setupData.industry = industrySelect.value;
    setupData.country = countrySelect.value;
    
    // Get product
    if (productSelect.value === 'custom') {
        setupData.product = customProductInput.value.trim() || 'Custom';
    } else if (productSelect.value) {
        setupData.product = productSelect.options[productSelect.selectedIndex].text;
    } else {
        setupData.product = '';
    }
    
    // Set formula images based on language
    if (setupData.language === 'de') {
        formulaImgVoting.src = 'Teamkraft-Formel.jpg';
        formulaImgResult.src = 'Teamkraft-Formel.jpg';
    } else {
        formulaImgVoting.src = 'Teamkraft-Formel-1024-eng.jpg';
        formulaImgResult.src = 'Teamkraft-Formel-1024-eng.jpg';
    }
    
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
    
    // Update select options
    const optionElements = document.querySelectorAll('option[data-de][data-en]');
    optionElements.forEach(el => {
        const text = currentLanguage === 'de' ? el.dataset.de : el.dataset.en;
        el.textContent = text;
    });
    
    // Update placeholders
    if (customProductInput) {
        const placeholder = currentLanguage === 'de' 
            ? customProductInput.dataset.placeholderDe 
            : customProductInput.dataset.placeholderEn;
        customProductInput.placeholder = placeholder;
    }
}

// Show PIN Modal
function showPinModal() {
    if (getTotalVotes() === 0) return;
    
    pinModal.classList.add('active');
    pinInput.value = '';
    pinError.style.display = 'none';
    pinInput.classList.remove('error');
    setTimeout(() => pinInput.focus(), 100);
    updateLanguage();
}

// Hide PIN Modal
function hidePinModal() {
    pinModal.classList.remove('active');
    pinInput.value = '';
    pinError.style.display = 'none';
    pinInput.classList.remove('error');
}

// Check PIN
function checkPin() {
    const enteredPin = pinInput.value.trim();
    
    if (enteredPin === CORRECT_PIN) {
        hidePinModal();
        showResults();
    } else {
        // Show error
        pinError.style.display = 'block';
        pinInput.classList.add('error');
        pinInput.value = '';
        pinInput.focus();
        
        // Hide error after 3 seconds
        setTimeout(() => {
            pinError.style.display = 'none';
            pinInput.classList.remove('error');
        }, 3000);
    }
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
    
    // Reset setup data
    setupData = {
        language: '',
        industry: '',
        country: '',
        product: ''
    };
    
    canVote = true;
    currentLanguage = 'de';
    
    // Reset form
    setupForm.reset();
    languageBtns.forEach(btn => btn.classList.remove('selected'));
    customProductSection.style.display = 'none';
    startBtn.disabled = true;
    
    // Reset displays
    totalVotesDisplay.textContent = '0';
    
    // Disable end voting button
    endVotingBtn.disabled = true;
    
    // Enable voting buttons
    voteButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    // Switch to language screen
    switchScreen(languageScreen);
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

// Download Results as Text File
function downloadResults() {
    const total = getTotalVotes();
    
    if (total === 0) return;
    
    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US');
    const timeStr = now.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US');
    
    // Translations
    const translations = {
        de: {
            title: 'Ergebnis Teamkraft',
            subtitle: 'Abstimmungsergebnis',
            setupInfo: 'Veranstaltungsinformationen',
            language: 'Sprache',
            industry: 'Branche',
            country: 'Land',
            product: 'Produkt',
            date: 'Datum',
            time: 'Uhrzeit',
            totalVotes: 'Gesamtstimmen',
            details: 'Detaillierte Ergebnisse',
            decreased: 'Gesunken',
            same: 'Gleich geblieben',
            slightlyIncreased: 'Leicht gestiegen',
            moderatelyIncreased: 'Mittel gestiegen',
            stronglyIncreased: 'Stark gestiegen',
            votes: 'Stimmen',
            percentage: 'Prozent'
        },
        en: {
            title: 'Results Teampower',
            subtitle: 'Voting Results',
            setupInfo: 'Event Information',
            language: 'Language',
            industry: 'Industry',
            country: 'Country',
            product: 'Product',
            date: 'Date',
            time: 'Time',
            totalVotes: 'Total Votes',
            details: 'Detailed Results',
            decreased: 'Decreased',
            same: 'Stayed the same',
            slightlyIncreased: 'Slightly increased',
            moderatelyIncreased: 'Moderately increased',
            stronglyIncreased: 'Strongly increased',
            votes: 'Votes',
            percentage: 'Percentage'
        }
    };
    
    const t = translations[currentLanguage];
    
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
    
    // Create text content
    let textContent = '';
    textContent += '='.repeat(60) + '\n';
    textContent += t.title.toUpperCase() + '\n';
    textContent += t.subtitle + '\n';
    textContent += '='.repeat(60) + '\n\n';
    
    textContent += `${t.date}: ${dateStr}\n`;
    textContent += `${t.time}: ${timeStr}\n\n`;
    
    // Setup Information
    if (setupData.industry || setupData.country || setupData.product) {
        textContent += '-'.repeat(60) + '\n';
        textContent += t.setupInfo + ':\n';
        textContent += '-'.repeat(60) + '\n';
        if (setupData.language) {
            textContent += `${t.language}: ${setupData.language === 'de' ? 'Deutsch' : 'English'}\n`;
        }
        if (setupData.industry) {
            const industryOption = industrySelect.querySelector(`option[value="${setupData.industry}"]`);
            const industryText = industryOption ? industryOption.textContent : setupData.industry;
            textContent += `${t.industry}: ${industryText}\n`;
        }
        if (setupData.country) {
            const countryOption = countrySelect.querySelector(`option[value="${setupData.country}"]`);
            const countryText = countryOption ? countryOption.textContent : setupData.country;
            textContent += `${t.country}: ${countryText}\n`;
        }
        if (setupData.product) {
            textContent += `${t.product}: ${setupData.product}\n`;
        }
        textContent += '\n';
    }
    
    textContent += '-'.repeat(60) + '\n';
    textContent += `${t.totalVotes}: ${total}\n`;
    textContent += '-'.repeat(60) + '\n\n';
    
    textContent += t.details + ':\n';
    textContent += '='.repeat(60) + '\n\n';
    
    textContent += `1. ${t.decreased}\n`;
    textContent += `   ${t.votes}: ${results['-1'].count}\n`;
    textContent += `   ${t.percentage}: ${results['-1'].percent}%\n\n`;
    
    textContent += `2. ${t.same}\n`;
    textContent += `   ${t.votes}: ${results['0'].count}\n`;
    textContent += `   ${t.percentage}: ${results['0'].percent}%\n\n`;
    
    textContent += `3. ${t.slightlyIncreased}\n`;
    textContent += `   ${t.votes}: ${results['1'].count}\n`;
    textContent += `   ${t.percentage}: ${results['1'].percent}%\n\n`;
    
    textContent += `4. ${t.moderatelyIncreased}\n`;
    textContent += `   ${t.votes}: ${results['2'].count}\n`;
    textContent += `   ${t.percentage}: ${results['2'].percent}%\n\n`;
    
    textContent += `5. ${t.stronglyIncreased}\n`;
    textContent += `   ${t.votes}: ${results['3'].count}\n`;
    textContent += `   ${t.percentage}: ${results['3'].percent}%\n\n`;
    
    textContent += '='.repeat(60) + '\n';
    textContent += currentLanguage === 'de' 
        ? 'Generiert mit Teamkraft Bewertungs-App\n'
        : 'Generated with Teampower Voting App\n';
    textContent += '='.repeat(60) + '\n';
    
    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = currentLanguage === 'de' 
        ? `Teamkraft_Ergebnis_${dateStr.replace(/\./g, '-')}.txt`
        : `Teampower_Results_${dateStr.replace(/\//g, '-')}.txt`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Initialize app
init();
