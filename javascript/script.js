//Global Variables
const timelineSpace = 0.81;

// Get data from life-events.json
fetch('./data/life-events.json')
    .then(response => response.json())
    .then(data => createTimeline(data));

function createTimeline(data) {
    const timeline = document.getElementById('timeline');
    let totalWidth = 0;

    data.forEach((e, index) => {
        const eElement = document.createElement('div');
        eElement.className = 'event';
        eElement.style.left = calculateLeftPosition(e, index, data.length);

        eElement.innerHTML = `
            <div class="marker" tabindex="0" aria-expanded="false"></div>
            <div class="date">${e.date}</div>
            <div class="title">${e.title}</div>
            <div class="details">
                <h2 class="details-title">${e.event}</h2>
                <p class='description'>${e.description}</p>
                <img src="${e.img}" alt="${e.title}" class="details-img"></img>
                <p class="details-btn">Click To Close</p>
            </div>
            `;
        timeline.appendChild(eElement);

        //Calculates the width of the current event
        const eventWidth = eElement.offsetWidth;
        totalWidth += eventWidth;
            
    });

    // Set the width of the #line element based on the calculated total width
    const line = document.getElementById('line');
    line.style.width = `${totalWidth * timelineSpace}px`; 


    addInteractivity();
}

function addInteractivity() {
    const style = getComputedStyle(document.body);
    const hoverFontSize = style.getPropertyValue('--timeline-hover-font-size');
    const hoverColor = style.getPropertyValue('--timeline-hover-color');
    const timelineContainer = document.getElementById('timeline-con');
    const containerWidth = timelineContainer.offsetWidth;
    const calcline = document.getElementById('line');
    const totalWidth = calcline.offsetWidth;
    const numSegments = Math.ceil((totalWidth * timelineSpace)/ containerWidth);

    document.querySelectorAll('.marker').forEach(marker => {
        marker.addEventListener('click', () => {
            const expanded = marker.getAttribute('aria-expanded') === 'true';
            marker.setAttribute('aria-expanded', !expanded);
        });

         // Add mouseover and mouseout event listeners to change the styles of .title and .date
         marker.addEventListener('mouseover', () => {
            const title = marker.nextElementSibling;
            const date = title.nextElementSibling;
            title.style.fontSize = hoverFontSize;
            title.style.color = hoverColor;
            date.style.fontSize = hoverFontSize;
            date.style.color = hoverColor;
        });

        marker.addEventListener('mouseout', () => {
            const title = marker.nextElementSibling;
            const date = title.nextElementSibling;
            title.style.fontSize = '1.5em';
            title.style.color = '#000'; // Change this to the original color
            date.style.fontSize = '1.5em';
            date.style.color = '#000'; // Change this to the original color
        });
    });

    document.querySelectorAll('.details-btn').forEach(hideDetails => {
        hideDetails.addEventListener('click', () => {
          const marker = hideDetails.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
          marker.setAttribute('aria-expanded', 'false');
        });
      });
    
      const prevButton = document.getElementById('prev');
      const nextButton = document.getElementById('next');
      
      prevButton.addEventListener('click', () => {
          timelineContainer.scrollTo({
              left: timelineContainer.scrollLeft - (totalWidth * timelineSpace / numSegments), // Change this value to adjust the scroll distance
              behavior: 'smooth'
          });
      });
      
      nextButton.addEventListener('click', () => {
          timelineContainer.scrollTo({
              left: timelineContainer.scrollLeft + (totalWidth * timelineSpace / numSegments), // Change this value to adjust the scroll distance
              behavior: 'smooth'
          });
      });
}

function calculateLeftPosition(e, index, total) {
    return (index / (total -1)) * 100 + '%';
}