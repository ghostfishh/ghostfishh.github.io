(function () {
    function initWorkShowcase() {
    const projects = {
        lighting: {
            title: "Ghost's Lighting",
            tag: "Roblox Plugin",
            desc: "A full lighting plugin built to make Roblox lighting setup faster and easier for developers.",
            video: "https://www.youtube-nocookie.com/embed/-ncwsJhSOxA",
            isYoutube: true,
            links: [
                { label: "Get Plugin", url: "https://create.roblox.com/store/asset/79551054130462/Ghosts-Lighting", icon: "fas fa-puzzle-piece" },
                { label: "View on YouTube", url: "https://www.youtube.com/watch?v=-ncwsJhSOxA", icon: "fab fa-youtube" }
            ]
        },
        cutscene: {
            title: "Cutscene System",
            tag: "Roblox System",
            desc: "A cutscene system made from scratch which focuses on showing camera movement.",
            video: "project-cutscene.mp4",
            links: []
        },
        sprint: {
            title: "Sprint System",
            tag: "Roblox System",
            desc: "A sprint system with custom UI and a separate mobile version.",
            video: "project-sprint.mp4",
            extraVideo: { title: "Mobile Version", src: "project-sprintmobile.mp4" },
            links: []
        },
        skeletons: {
            title: "Skeleton Summoner",
            tag: "Roblox System",
            desc: "A quick ability system that summons skeletons from the ground.",
            video: "project-skeletons.mp4",
            links: []
        },
        health: {
            title: "Max Health Shop",
            tag: "Roblox System",
            desc: "A max-health shop system made for a brainrot game.",
            video: "project-health.mp4",
            links: []
        },
        npc: {
            title: "NPC System",
            tag: "Roblox System",
            desc: "An NPC follow system that moves with the player until it reaches a target area.",
            video: "project-npc.mp4",
            links: []
        },
        runanim: {
            title: "Sprint Animation",
            tag: "Animation",
            desc: "A short sprint animation I made for a quick comission.",
            video: "project-runanim.mp4",
            links: []
        },
        miniboi: {
            title: "Friend's Website",
            tag: "Web Build",
            desc: "A custom website built from scratch for a close friend.",
            img: "project-miniboi.png",
            links: [
                { label: "View Live", url: "https://miniboibfmr.github.io/", icon: "fas fa-external-link-alt" }
            ]
        },
        portfolio: {
            title: "Old Portfolio",
            tag: "Web Build",
            desc: "An earlier version of this portfolio.",
            img: "project-portfolio.png",
            links: [
                { label: "View Live", url: "https://ghostfishh.github.io/", icon: "fas fa-external-link-alt" },
                { label: "GitHub", url: "https://github.com/ghostfishh", icon: "fab fa-github" }
            ]
        },
        subaru: {
            title: "Subaru - Music Producer",
            tag: "Web Build",
            desc: "A website for a music producer, focused on giving the artist a clean reputation.",
            img: "project-subaru.png",
            links: [
                { label: "View Live", url: "https://cashseries.github.io/", icon: "fas fa-external-link-alt" }
            ]
        },
        placement: {
            title: "Ghost's Placement System",
            tag: "Roblox System",
            desc: "A custom placement system made as a sellable system.",
            img: "project-placement.png",
            links: [
                { label: "Watch Trailer", url: "https://www.youtube.com/watch?v=RKQXOln-2Q0", icon: "fab fa-youtube" },
                { label: "Join Discord", url: "https://discord.gg/your-server", icon: "fab fa-discord" }
            ]
        },
        music: {
            title: "Roblox Music Player System",
            tag: "Roblox System",
            desc: "An easy-to-use music player system with visualizers, curated playlists, documentation, and a test place.",
            badge: { text: "Free to use", icon: "fas fa-gift" },
            video: "music-showcase.mp4",
            links: [
                { label: "View Docs", url: "music-docs.html", icon: "fas fa-book" },
                { label: "Download Place", url: "MusicSystem.rbxl", icon: "fas fa-download", download: true }
            ]
        },
        timestop: {
            title: "Time Stop Ability",
            tag: "Roblox Ability",
            desc: "A Roblox time-stop ability preview from Jojo's Bizarre Adventure.",
            video: "project-timestop.mp4",
            links: []
        },
        loot: {
            title: "Loot System",
            tag: "Roblox System",
            desc: "A loot system using proximity prompts.",
            video: "project-loot.mp4",
            links: [
                { label: "View Source", url: "https://pastebin.com/a51NyL1k", icon: "fas fa-code" }
            ]
        }
    };

    function resolveLocalImageSrc(img) {
        if (!img) return null;
        if (img.includes('://')) return img;
        if (img.startsWith('assets/')) return img;
        return 'assets/images/' + img;
    }

    function mediaMarkup(project, fallbackImgSrc) {
        if (project.isYoutube) {
            return '<iframe src="' + project.video + '" frameborder="0" allow="fullscreen" title="' + project.title + '" allowfullscreen></iframe>';
        }

        if (project.video) {
            const src = project.video.includes('://') ? project.video : 'assets/video/' + project.video;
            return '<video autoplay muted loop playsinline controls preload="metadata" src="' + src + '"></video>';
        }

        var resolved = resolveLocalImageSrc(project.img) || resolveLocalImageSrc(fallbackImgSrc);
        if (!resolved) {
            return '<div class="inline-detail-desc">No preview available.</div>';
        }

        return '<img src="' + resolved + '" alt="' + project.title + '">';
    }

    function linkMarkup(project) {
        var links = project.links || [];
        if (!links.length) {
            return '<span class="inline-detail-desc">No external link for this one yet.</span>';
        }

        return links.map(function (link) {
            var target = link.download ? '' : ' target="_blank" rel="noopener"';
            var download = link.download ? ' download' : '';
            return '<a href="' + link.url + '"' + target + download + '><i class="' + link.icon + '"></i> ' + link.label + '</a>';
        }).join('');
    }

    function extraMarkup(project) {
        if (!project.extraVideo) return '';

        return '<div class="inline-detail-extra">' +
            '<h4>' + project.extraVideo.title + '</h4>' +
            '<video autoplay muted loop playsinline controls preload="metadata" src="' + project.extraVideo.src + '"></video>' +
            '</div>';
    }

    function badgeMarkup(project) {
        if (!project.badge) return '';

        return '<div class="drawer-badge"><i class="' + project.badge.icon + '"></i> ' + project.badge.text + '</div>';
    }

    function closeCurrentDetail() {
        var current = document.querySelector('.inline-project-detail');
        if (current) current.remove();

        document.querySelectorAll('.pg-card.expanded').forEach(function (card) {
            card.classList.remove('expanded');
            var cta = card.querySelector('.pg-cta');
            if (cta) cta.innerHTML = '<i class="fas fa-arrow-right"></i> View project';
        });
    }

    function openInlineDetail(card) {
        var project = projects[card.dataset.project];
        if (!project) return;

        var alreadyOpen = card.classList.contains('expanded');
        closeCurrentDetail();
        if (alreadyOpen) return;

        card.classList.add('expanded');
        var cta = card.querySelector('.pg-cta');
        if (cta) cta.innerHTML = '<i class="fas fa-chevron-up"></i> Hide details';


        var cardImg = card.querySelector('.pg-media img');
        var fallbackImgSrc = cardImg ? cardImg.getAttribute('src') : null;

        var detail = document.createElement('div');
        detail.className = 'inline-project-detail reveal active';
        detail.setAttribute('aria-live', 'polite');
        detail.innerHTML =
            '<div class="inline-detail-media">' + mediaMarkup(project, fallbackImgSrc) + extraMarkup(project) + '</div>' +
            '<div class="inline-detail-copy">' +
            '<span class="inline-detail-label">' + project.tag + '</span>' +
            '<h3 class="inline-detail-title">' + project.title + '</h3>' +
            '<p class="inline-detail-desc">' + project.desc + '</p>' +
            badgeMarkup(project) +
            '<div class="inline-detail-links">' + linkMarkup(project) + '</div>' +
            '</div>';

        card.insertAdjacentElement('afterend', detail);
        detail.querySelectorAll('a, video, iframe').forEach(function (el) {
            el.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        });
        detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    document.querySelectorAll('.pg-card').forEach(function (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View details for ' + ((projects[card.dataset.project] && projects[card.dataset.project].title) || 'project'));

        card.addEventListener('click', function (event) {
            if (event.target.closest('video, iframe, a, button')) return;
            openInlineDetail(card);
        });

        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openInlineDetail(card);
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeCurrentDetail();
    });

    document.querySelectorAll('[data-category]').forEach(function (el) {
        if (el.tagName === 'BUTTON') {
            el.addEventListener('click', function () {
                closeCurrentDetail();
            });
        }
    });


    closeCurrentDetail();
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkShowcase);
    } else {
        initWorkShowcase();
    }
})();
