/**
 * @file index_projects.js
 * @description Fetches project data from a JSON file and renders
 * each project into three separate DOM sections: list, decorations, and descriptions.
 */

/**
 * Loads project data from the JSON source and populates the projects UI.
 *
 * Renders three elements per project:
 * - A linked card with name and thumbnail in `#projectsList`.
 * - A pair of decorative SVG icons in `#projectsDecoration`.
 * - A description paragraph in `#projectsDescription`.
 *
 * @async
 * @throws {Error} Logs to console if the fetch fails or the JSON is malformed.
 */
export async function initProjects() {
    try {
        let projectsData = await fetch('./files/index/json/projects.json');
        projectsData = await projectsData.json();
        
        const projectsList        = document.getElementById('projectsList');
        const projectsDecoration  = document.getElementById('projectsDecoration');
        const projectsDescription = document.getElementById('projectsDescription');

        projectsData.projects.forEach(project => {

            projectsList.insertAdjacentHTML('beforeend', `
                <a class="project" href="${project.link}" target="_blank" rel="noopener noreferrer">
                    <span>${project.name}</span>
                    <img src="${project.img}" alt="${project.name}">
                </a>
            `);

            projectsDecoration.insertAdjacentHTML('beforeend', `
                <img src="https://res.cloudinary.com/dvqteoxap/image/upload/v1779317144/projects_decoration_2_pzygfy.svg" alt="Project Decoration 2" class="projectDecoration2">
                <img src="https://res.cloudinary.com/dvqteoxap/image/upload/v1779317144/projects_decoration_1_svht1f.svg" alt="Project Decoration 1" class="projectDecoration1">
            `);

            projectsDescription.insertAdjacentHTML('beforeend', `
                <div class="projectDescription">
                    <p>${project.description}</p>
                </div>
            `);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}