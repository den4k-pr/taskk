document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide1');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;
    const transitionSpeed = 300;

    function updateProgress(index) {
        const progressPercent = ((index + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = totalSlides - 1;
        } else if (newIndex >= totalSlides) {
            newIndex = 0;
        }
        
        slides[currentIndex].classList.remove('active');
        currentIndex = newIndex;
        slides[currentIndex].classList.add('active');
        updateProgress(currentIndex);
        
        setTimeout(() => {
            isTransitioning = false;
        }, transitionSpeed);
    }
    
    function setInitialSlide() {
        if (slides.length > 0) {
            slides[0].classList.add('active');
            updateProgress(0);
        }
    }
    
    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });
    
    prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });
    
    setInitialSlide(); 
});



document.querySelectorAll('.wrapperElement-10-section').forEach(section => {
    const top = section.querySelector('.wrapperElement-10-section-top');
    const bottom = section.querySelector('.wrapperElement-10-section-bottom');
    const arrow = top.querySelector('img');

    // Початковий стан (приховано тільки bottom)
    bottom.style.maxHeight = '0';
    bottom.style.opacity = '0';
    bottom.style.overflow = 'hidden';
    bottom.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';

    top.addEventListener('click', () => {
        const isOpen = section.classList.toggle('active');

        if (isOpen) {
            bottom.style.maxHeight = bottom.scrollHeight + 'px';
            bottom.style.opacity = '1';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            bottom.style.maxHeight = '0';
            bottom.style.opacity = '0';
            arrow.style.transform = 'rotate(0deg)';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const timer = document.querySelector('.footer-timer');
    const values = timer.querySelectorAll('.footer-timer-value');

    const TOTAL_TIME = 24 * 60 * 60; // 24 години у секундах
    const STORAGE_KEY = 'timerEndTime';

    // Отримуємо кінець таймера з localStorage або створюємо новий
    let endTime = localStorage.getItem(STORAGE_KEY);

    if (!endTime) {
        endTime = Date.now() + TOTAL_TIME * 1000; // новий відлік
        localStorage.setItem(STORAGE_KEY, endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }

    function updateTimer() {
        const now = Date.now();
        let remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
            clearInterval(interval);
            localStorage.removeItem(STORAGE_KEY);
            values[0].textContent = '00';
            values[1].textContent = '00';
            values[2].textContent = '00';
            return;
        }

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;

        values[0].textContent = String(hours).padStart(2, '0');
        values[1].textContent = String(minutes).padStart(2, '0');
        values[2].textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
});


document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    const slider = wrapper.querySelector('.slider');
    const slides = Array.from(wrapper.querySelectorAll('.slide'));
    const prevBtn = wrapper.querySelector('#prev');
    const nextBtn = wrapper.querySelector('#next');
    const progressBar = wrapper.querySelector('.progress-bar');

    if (!slider || !prevBtn || !nextBtn || slides.length === 0) {
      console.error("Slider elements not found in wrapper:", wrapper);
      return;
    }

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone', 'first-clone');
    lastClone.classList.add('clone', 'last-clone');
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);

    let index = 1; 
    let step = getStep();
    let isTransitioning = false;

    function getStep() {
        return window.matchMedia('(max-width: 600px)').matches ? 28.2 : 33.3;
    }

    function updateSlider(animate = true) {
        if (animate) slider.style.transition = 'transform 0.4s ease-in-out';
        else slider.style.transition = 'none';

        if (window.matchMedia('(max-width: 600px)').matches) {
            slider.style.transform = `translateX(-${index * step}rem)`;
        } else {
            slider.style.transform = `translateX(-${index * step}%)`;
        }


        if (progressBar) {

            let displayIndex = index;
            if (index === 0) displayIndex = slides.length;
            if (index > slides.length) displayIndex = 1;
            const progress = ((displayIndex - 1) / slides.length) * 100;

            progressBar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
        }
    }

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index++;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index--;
        updateSlider();
    });


    slider.addEventListener('transitionend', () => {
        let needsReset = false;
        let resetToIndex = index;


        if (index === slides.length + 1) {
            resetToIndex = 1; 
            needsReset = true;
        }

        else if (index === 0) {
            resetToIndex = slides.length;
            needsReset = true;
        }

        if (needsReset) {

            setTimeout(() => {
                index = resetToIndex; 
                updateSlider(false); 
                isTransitioning = false;
            }, 0); 
        } else {

            isTransitioning = false;
        }
    });

    let startX = 0;
    let moveX = 0;
    let isSwiping = false;

    slider.addEventListener('touchstart', e => {
 
        if (isTransitioning) return;
        startX = e.touches[0].clientX;

        isSwiping = true;
    }, { passive: true }); // Додаємо passive: true

    slider.addEventListener('touchmove', e => {
        if (!isSwiping) return;
        moveX = e.touches[0].clientX - startX;
     }, { passive: true }); // Додаємо passive: true

    slider.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        if (moveX < -50) {

            if (!isTransitioning) nextBtn.click();
        } else if (moveX > 50) {

            if (!isTransitioning) prevBtn.click();
        } else {

        }
        moveX = 0;
    });

    window.addEventListener('resize', () => {
        step = getStep();
        updateSlider(false);
    });

    updateSlider(false);
});
