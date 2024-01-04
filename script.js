// Function to fetch data from an API
async function fetchData() {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Fetch the data initially
let storedData = null;

async function getOrFetchData() {
    if (storedData === null) {
        storedData = await fetchData();
    }
    return storedData;
}

function removeActiveClassFromButtons() {
    const buttons = document.querySelectorAll('.tabs button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
}

function updateContent(timeframe, data) {
    data.forEach(activity => {
        const sectionId = activity.title.toLowerCase().replace(' ', '-');
        const section = document.getElementById(sectionId);
        const currentHours = activity.timeframes[timeframe].current;
        const previousHours = activity.timeframes[timeframe].previous;

        const currentHoursElement = section.querySelector('.current-hours');
        const previousHoursElement = section.querySelector('.previous-hours');

        currentHoursElement.textContent = `${currentHours}hrs`;
        previousHoursElement.textContent = `Last ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} - ${previousHours}hrs`;
    });
}

const allTabs = document.querySelector('.tabs');

// Fetch the data immediately on page load
window.addEventListener('DOMContentLoaded', async () => {
    const data = await getOrFetchData();
    updateContent('daily', data); // Update with daily data after fetching
});

allTabs.addEventListener('click', async function(event) {
    if (event.target.tagName === 'BUTTON') {
        removeActiveClassFromButtons();
        event.target.classList.add('active');

        const data = await getOrFetchData();
        const buttonText = event.target.textContent.toLowerCase();

        switch (buttonText) {
            case 'daily':
                updateContent('daily', data);
                console.log('Daily button clicked');
                break;
            case 'weekly':
                updateContent('weekly', data);
                console.log('Weekly button clicked');
                break;
            case 'monthly':
                updateContent('monthly', data);
                console.log('Monthly button clicked');
                break;
            default:
                break;
        }
    }
});
