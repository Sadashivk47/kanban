# Kanban Task Board – Learning Notes

## Project Overview

This project is a Kanban Task Board built using React and Vite.  
The goal of this project was to learn modern frontend development concepts like component-based architecture, state management, and drag-and-drop interactions.

---

# What I Learned

## 1. React Fundamentals

While building this project, I learned:

- Functional Components
- JSX structure
- Props
- State management using `useState`
- Side effects using `useEffect`

I also understood how React updates the UI automatically when state changes instead of manually manipulating the DOM.

---

## 2. Component-Based Architecture

I separated the application into reusable components like:

- `App`
- `Column`
- `Card`

This helped me understand:
- code reusability
- cleaner project structure
- passing data using props

---

## 3. State Management

I learned how to:
- store tasks in state
- update tasks dynamically
- move tasks between columns
- edit and delete tasks

Using React state made the application interactive and reactive.

---

## 4. Local Storage Persistence

I implemented `localStorage` to persist tasks even after refreshing the browser.

This helped me learn:
- saving data in browser storage
- loading saved data on startup
- syncing state with localStorage using `useEffect`

---

## 5. Drag and Drop

For Level 3 functionality, I learned how to use the `dnd-kit` library.

Concepts learned:
- `DndContext`
- `useSortable`
- drag events
- drop zones
- smooth drag interactions

This was one of the most challenging and interesting parts of the project.

---

## 6. Search and Filtering

I implemented a search feature to filter tasks dynamically.

This improved my understanding of:
- array filtering
- controlled inputs
- dynamic rendering in React

---

## 7. UI and Styling

I used custom CSS to build a modern dark-themed interface.

I learned:
- responsive layouts using Flexbox
- reusable CSS classes
- hover effects and transitions
- organizing styles for larger components

---

# Challenges Faced

Some issues I faced during development:

- Drag-and-drop tasks disappearing initially
- Edit mode conflicting with drag events
- CSS not loading correctly at first
- Vercel deployment root directory issue
- Managing smooth drag interactions

Fixing these issues helped me understand debugging and project structure better.

---

# Tools and Technologies Used

- React
- Vite
- JavaScript
- CSS
- dnd-kit
- localStorage
- Vercel
- Git & GitHub

---

# Final Outcome

This project helped me transition from basic JavaScript DOM manipulation to the React way of building applications using components and state-driven UI updates.

It also improved my understanding of frontend architecture, debugging, deployment, and interactive UI development.
