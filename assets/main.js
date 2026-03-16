const projects = [
  {
    slug: 'cv',
    name: 'CV',
    path: './cv/',
    summary: 'Basic CV, gallery, and schedule pages.',
  },
  {
    slug: 'dom',
    name: 'DOM tasks',
    path: './dom/',
    summary: 'Small vanilla JS DOM exercises.',
  },
  {
    slug: 'xml',
    name: 'XML render',
    path: './xml/',
    summary: 'XML-driven content rendering.',
  },
  {
    slug: 'map',
    name: 'Map & gallery',
    path: './map/',
    summary: 'Map page with gallery and JSON feed.',
  },
  {
    slug: 'exam1',
    name: 'Exam 1',
    path: './exam1/',
    summary: 'First exam mini-site.',
  },
  {
    slug: 'exam2',
    name: 'Exam 2',
    path: './exam2/',
    summary: 'Second exam with JS interactions.',
  },
  {
    slug: 'game',
    name: 'Game',
    path: './game/game/',
    summary: 'Popoluška drag-and-drop mini-game (PWA).',
  },
]

function renderList() {
  const list = document.getElementById('project-list')
  if (!list) return
  list.innerHTML = ''
  projects.forEach((project) => {
    const row = document.createElement('div')
    row.className = 'project-row'

    const meta = document.createElement('div')
    meta.className = 'project-meta'
    const title = document.createElement('p')
    title.className = 'project-title'
    title.textContent = project.name
    const desc = document.createElement('p')
    desc.className = 'project-desc'
    desc.textContent = project.summary
    meta.append(title, desc)

    const link = document.createElement('a')
    link.className = 'project-link'
    link.href = project.path
    link.textContent = 'Open'

    row.append(meta, link)
    list.append(row)
  })
}

document.addEventListener('DOMContentLoaded', renderList)
