function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function daysBetween(startDate, endDate = new Date()) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((endDate - startDate) / msPerDay);
}

function daysUntil(targetDate, fromDate = new Date()) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((targetDate - fromDate) / msPerDay);
}

document.addEventListener('DOMContentLoaded', () => {


    const hideLoader = () => {
        const loader = document.querySelector('.loading-screen');
        if (!loader || loader.dataset.hidden === 'true') return;

        loader.dataset.hidden = 'true';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    };

    setTimeout(hideLoader, 450);
    window.addEventListener('load', hideLoader);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const updateScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = scrolled + "%";
    };
    window.addEventListener('scroll', debounce(updateScrollProgress, 10), { passive: true });

    const updateSystemData = () => {
        const now = new Date();
        const chiTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });
        const timeEl = document.getElementById('chicago-time');
        if (timeEl) timeEl.innerText = chiTime;



        const gradEl = document.getElementById('graduation-counter');
        if (gradEl) {
            const diffGrad = daysUntil(new Date('2029-05-22'), now);
            gradEl.innerText = diffGrad > 0 ? `${diffGrad} DAYS TIL FREEDOM` : `TARGET REACHED`;
        }
    };
    updateSystemData();
    setInterval(updateSystemData, 1000);

    const facts = document.querySelectorAll('.fact-item');
    const nextBtn = document.getElementById('nextFact');
    const prevBtn = document.getElementById('prevFact');
    let currentFactIndex = 0;
    if (nextBtn && prevBtn && facts.length > 0) {
        const showFact = (index) => {
            facts.forEach(fact => fact.classList.remove('active'));
            facts[index].classList.add('active');
        };
        nextBtn.addEventListener('click', () => {
            currentFactIndex = (currentFactIndex + 1) % facts.length;
            showFact(currentFactIndex);
        });
        prevBtn.addEventListener('click', () => {
            currentFactIndex = (currentFactIndex - 1 + facts.length) % facts.length;
            showFact(currentFactIndex);
        });
    }

    const tabs = document.querySelectorAll('.category-tab');
    const contents = document.querySelectorAll('.category-content');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                tabs.forEach(t => t.classList.toggle('active', t === tab));
                contents.forEach(c => c.classList.toggle('active', c.getAttribute('data-category') === category));

                const activeContent = document.querySelector(`.category-content.active`);
                if (activeContent) {
                    activeContent.querySelectorAll('.reveal').forEach(el => {
                        el.classList.remove('active');
                        setTimeout(() => el.classList.add('active'), 50);
                    });
                }
            });
        });
    }

    const audioPlayer = document.getElementById('audio-player');
    const audioPlayBtn = document.getElementById('audio-play-btn');
    const transcriptContainer = document.getElementById('transcript-container');
    const progressFill = document.getElementById('progress-fill');
    const progressContainer = document.getElementById('progress-container');

    if (audioPlayer && audioPlayBtn && transcriptContainer) {
        function renderTranscript(data) {
            transcriptContainer.innerHTML = '';
            const p = document.createElement('p');
            p.style.margin = '0';
            p.style.textAlign = 'center';
            data.segments.forEach(segment => {
                segment.words.forEach(wordObj => {
                    if (wordObj.type === 'word') {
                        const span = document.createElement('span');
                        span.className = 'word' + (wordObj.text.toLowerCase().includes('impossible') ? ' impossible-red' : '');
                        span.textContent = wordObj.text;
                        span.dataset.start = wordObj.start;
                        p.appendChild(span);
                    } else {
                        p.appendChild(document.createTextNode(' '));
                    }
                });
            });
            transcriptContainer.appendChild(p);
            const attr = document.createElement('div');
            attr.className = 'transcript-attribution';
            attr.textContent = '- Travis Scott';
            transcriptContainer.appendChild(attr);
        }

        if (typeof transcriptData !== 'undefined') {
            renderTranscript(transcriptData);
        } else {
            transcriptContainer.innerHTML = '<p style="color:var(--muted)">Transcript unavailable.</p>';
        }

        let syncReq;
        function updateSync() {
            const curr = audioPlayer.currentTime;
            const dur = audioPlayer.duration || 0;
            if (progressFill && dur > 0) progressFill.style.width = `${(curr / dur) * 100}%`;

            let activeWord = null;
            transcriptContainer.querySelectorAll('.word').forEach(word => {
                const start = parseFloat(word.dataset.start);
                if (curr >= start) {
                    word.classList.add('active');
                    activeWord = word;
                } else {
                    word.classList.remove('active');
                }
            });

            if (activeWord) {
                const boxRect = transcriptContainer.getBoundingClientRect();
                const wordRect = activeWord.getBoundingClientRect();
                const offset = (wordRect.top - boxRect.top) + transcriptContainer.scrollTop - (boxRect.height / 2);
                transcriptContainer.scrollTo({ top: offset, behavior: 'smooth' });
            }

            if (!audioPlayer.paused) syncReq = requestAnimationFrame(updateSync);
        }

        audioPlayBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                syncReq = requestAnimationFrame(updateSync);
            } else {
                audioPlayer.pause();
                audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                cancelAnimationFrame(syncReq);
            }
        });

        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audioPlayer.currentTime = pos * audioPlayer.duration;
                if (audioPlayer.paused) updateSync();
            });
        }
    }

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalMedia = document.getElementById('modal-media');
    const modalLinks = document.getElementById('modal-links');
    const projectCards = document.querySelectorAll('.project-card');

    const projectData = {
        'placement': {
            title: 'Ghost\'s Placement System',
            description: 'A placement system made by yours truly! Sold via Discord.',
            media: { type: 'image', url: 'assets/images/project-placement.png' },
            links: [
                { text: 'Watch the Trailer', url: 'https://www.youtube.com/watch?v=RKQXOln-2Q0', icon: 'fab fa-youtube' },
                { text: 'Join Discord', url: 'https://discord.gg/2Pech2WDzq', icon: 'fab fa-discord' }
            ]
        },
        'portfolio': {
            title: 'Old Portfolio Website',
            description: 'My previous portfolio version with a different aesthetic.',
            media: { type: 'image', url: 'assets/images/project-portfolio.png' },
            links: [
                { text: 'View Live', url: 'https://ghostfishh.github.io/', icon: 'fas fa-external-link-alt' },
                { text: 'GitHub', url: 'https://github.com/ghostfishh', icon: 'fab fa-github' }
            ]
        },
        'miniboi': {
            title: 'Friend\'s Website',
            description: 'Custom build for a close friend.',
            media: { type: 'image', url: 'assets/images/project-miniboi.png' },
            links: [{ text: 'View Live', url: 'https://miniboibfmr.github.io/', icon: 'fas fa-external-link-alt' }]
        },
        'subaru': {
            title: 'Subaru - Music Producer',
            description: 'Site for an awesome music production guy.',
            media: { type: 'image', url: 'assets/images/project-subaru.png' },
            links: [{ text: 'View Live', url: 'https://cashseries.github.io/', icon: 'fas fa-external-link-alt' }]
        },
        'music': {
            title: 'Ghost\'s Music Player',
            description: 'An easy-to-use music player for your Roblox experience with smooth animations, mood-based music, and a ready-made example you can drop into your game. <div style="margin-top: 15px; padding: 12px; background: rgba(39, 201, 63, 0.1); border-left: 4px solid #27c93f; border-radius: 4px; font-weight: 700; color: #27c93f; display: flex; align-items: center; gap: 8px;"><i class="fas fa-gift"></i> FREE TO USE</div>',
            media: { type: 'image', url: 'assets/images/project-music.png' },
            links: [
                { text: 'View Documentation', url: 'music-docs.html', icon: 'fas fa-book' },
                { text: 'Download Test Place', url: 'assets/model/MusicSystem.rbxl', icon: 'fas fa-download', download: true }
            ]
        }
    };

    function openModal(projectId) {
        const p = projectData[projectId];
        if (!p || !modal) return;
        modalTitle.textContent = p.title;
        modalDescription.innerHTML = p.description;
        modalMedia.innerHTML = '';
        if (p.media.type === 'video') {
            const f = document.createElement('iframe');
            f.src = p.media.url;
            f.allowFullscreen = true;
            modalMedia.appendChild(f);
        } else {
            const img = document.createElement('img');
            img.src = p.media.url;
            img.alt = p.title;
            modalMedia.appendChild(img);
        }
        modalLinks.innerHTML = '';
        p.links.forEach(l => {
            const a = document.createElement('a');
            a.href = l.url;
            a.className = 'modal-link';
            if (l.download) {
                a.download = '';
            } else {
                a.target = '_blank';
            }
            a.innerHTML = `<i class="${l.icon}"></i><span>${l.text}</span>`;
            modalLinks.appendChild(a);
        });
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    projectCards.forEach(c => {
        c.addEventListener('click', (e) => {
            if (!e.target.classList.contains('open-modal-btn')) {
                const id = c.dataset.project;
                if (id) openModal(id);
            }
        });
    });

    document.querySelectorAll('.open-modal-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = b.closest('.project-card')?.dataset.project;
            if (id) openModal(id);
        });
    });

    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    const travisVideo = document.getElementById('random-travis');
    if (travisVideo) {
        const travisSources = ['assets/video/TravisVideo.mp4', 'assets/video/TravisVideo2.mp4'];
        const randomSource = travisSources[Math.floor(Math.random() * travisSources.length)];
        const sourceElement = travisVideo.querySelector('source');
        if (sourceElement) {
            sourceElement.src = randomSource;
            travisVideo.load();
        }
    }

    function spawnSparkle(card) {
        const sparkle = document.createElement('div');
        sparkle.className = 'gold-sparkle';
        sparkle.innerHTML = '✦';

        const side = Math.floor(Math.random() * 4);
        const percent = Math.random() * 92 + 4;

        if (side === 0) {
            sparkle.style.top = '-8px';
            sparkle.style.left = percent + '%';
        } else if (side === 1) {
            sparkle.style.right = '-8px';
            sparkle.style.top = percent + '%';
        } else if (side === 2) {
            sparkle.style.bottom = '-8px';
            sparkle.style.left = percent + '%';
        } else {
            sparkle.style.left = '-8px';
            sparkle.style.top = percent + '%';
        }

        card.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
    }

    document.querySelectorAll('.gold-card').forEach(card => {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                spawnSparkle(card);
            }
        }, 1200);
    });

    let activeAudio = null;
    let activePlayBtn = null;

    document.querySelectorAll('.fav-play-btn').forEach(btn => {
        const audioSrc = btn.getAttribute('data-audio');
        const audio = new Audio(audioSrc);
        audio.volume = 0.5;


        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeAudio && activeAudio !== audio) {
                activeAudio.pause();
                if (activePlayBtn) activePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            }

            if (audio.paused) {
                audio.play();
                btn.innerHTML = '<i class="fas fa-pause"></i>';
                activeAudio = audio;
                activePlayBtn = btn;
            } else {
                audio.pause();
                btn.innerHTML = '<i class="fas fa-play"></i>';
                activeAudio = null;
                activePlayBtn = null;
            }
        });

        audio.addEventListener('ended', () => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            activeAudio = null;
            activePlayBtn = null;
        });
    });
});
