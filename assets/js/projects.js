$(document).ready(() => {
    render_projects('featured');
})


let render_projects = (slug) => {
    let projects_area = $('.projects-wrapper');

    $('.white-button').removeClass('white-button-hover');
    $(`#${slug}`).addClass('white-button-hover');

    let projects_obj = [
        {
            image: 'assets/images/CFG.png',
            link: false,
            title: 'Conditional Foley Generation',
            demo: false,
            technologies: ['CV', 'Python', 'PyTorch'],
            description: "We propose a model for generating a soundtrack for a silent input video, given a user-supplied example that specifies what the video should sound like.",
            categories: ['featured', 'CV']
        },
        {
            image: 'assets/images/argo.png',
            link: 'https://github.com/Yscorexm/ARGo',
            title: 'ARGo',
            demo: 'https://www.youtube.com/watch?v=mN4nRNxuwDw',
            technologies: ['Kotlin', 'ARCore'],
            description: "ARGo is an Android app that allows you to view, create, edit, and share AR sticky note to real-world items wherever your want.",
            categories: ['Others']
        },
        {
            image: 'assets/images/SSDA.png',
            link: 'https://github.com/narendoraiswamy/Domain_clustering_SSDA',
            title: 'SSDA',
            demo: false,
            technologies: ['CV', 'Python', 'PyTorch'],
            description: "A new SSDA algorithm based on the theory of mutual information maximization and adaptive adversarial loss for overcoming inter-domain and intra-domain shifts respectively.",
            categories: ['CV']
        },
        {
            image: 'assets/images/RetCCL.png',
            link: false,
            title: 'RetCCL',
            demo: false,
            technologies: ['CV', 'Python', 'PyTorch'],
            description: "RetCCL: Clustering-guided Contrastive Learning for Whole-slide Image Retrieval.",
            categories: ['featured', 'CV']
        },
        {
            image: 'assets/images/colorVAE.jpg',
            link: 'https://github.com/XYPB/ColorVAE',
            title: 'ColorVAE',
            demo: 'https://drive.google.com/file/d/1HQzCaNgMwJ8CPR0Vxa9Zt1a_jjqoBpHX/view',
            technologies: ['CV', 'Python', 'PyTorch'],
            description: "COLOR-VAE: Generative Colorization with Variational Auto-encoder",
            categories: ['featured', 'CV']
        },
        {
            image: 'assets/images/canvas.png',
            link: 'https://github.com/BoYanZh/Canvas-Syncer',
            title: 'CanvasSyncer',
            demo: false,
            technologies: ['Python'],
            description: "An async python script that synchronizes files and folders across Canvas Files and local, with extremely fast speed",
            categories: ['Others']
        },
        {
            image: 'assets/images/skeleton_encoding.png',
            link: 'https://github.com/zyayoung/skeleton-encode',
            title: 'SkeletonEncoder',
            demo: false,
            technologies: ['Python', 'CV'],
            description: "Automatic human skeleton keypoint recognition and lossless compression projects.",
            categories: ['featured', 'CV']
        },
    ]

    let projects = [];
    if(slug == 'all') {
        projects = projects_obj.map(project_mapper);
    } 
    else {
        projects = projects_obj.filter(project => project.categories.includes(slug)).map(project_mapper);
    }
    projects_area.hide().html(projects).fadeIn();
}

let project_mapper = project => {
    return `
        <div class="wrapper">
                
            <div class="card radius shadowDepth1">

                ${project.image ? 
                    `<div class="card__image border-tlr-radius">
                        <a href="${project.link}">
                            <img src="${project.image}" alt="image" id="project-image" class="border-tlr-radius">
                        </a>
                    </div>`           
                : ''}

        
                <div class="card__content card__padding">
        
                    <article class="card__article">
                        <h2><a href="${project.link}">${project.title}</a></h2>
        
                        <p class="paragraph-text-normal">${project.description} ${project.demo ? `<a href="${project.demo}">Demo</a>` : ''}</p>
                    </article>

                                
                    <div class="card__meta">
                        ${project.technologies.map(tech =>
                            `<span class="project-technology paragraph-text-normal">${tech}</span>`
                        ).join('')}
                    </div>

                </div>
            </div>
        </div>
    `
}

let selected = (slug) => {
    render_projects(slug);
}