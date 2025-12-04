# FlashLearn

FlashLearn is a feature-rich, mobile-responsive flashcard web application designed to help users create, review, and master content through active recall and spaced repetition. The app allows users to create custom decks and flashcards, track progress over time, delete unwanted items, and maintain a daily streak to boost motivation. This project is built with Django for the backend and JavaScript for dynamic frontend interactions. It is designed to go well beyond the scope and complexity of the standard course projects and demonstrates thoughtful design and implementation.

---

## 🚀 Distinctiveness and Complexity

FlashLearn is both **distinct from other projects in the course** and **significantly more complex** in its implementation and feature set. Here's why:

### 1. **Not a Social Network, Not an E-commerce Site**
Unlike the social network and e-commerce projects included in the course, FlashLearn is built around **content creation and memory optimization**. It features a customized data model, complex logic for scheduling and reviewing flashcards, and highly interactive client-side behavior — none of which are covered in the earlier projects.

### 2. **Spaced Repetition & Streak Tracking**
The app introduces a **simplified spaced repetition algorithm** inspired by popular tools like Anki. It tracks when cards are due and separates them into “Due Today,” “Due Soon,” and “Mastered” categories. This introduces non-trivial logic in the view layer and meaningful use of `DateTime` calculations. Additionally, it features a **user streak system** that calculates how many consecutive days a user has studied — providing motivational gamification.

### 3. **Progress Visualization**
FlashLearn implements **real-time visual progress bars** that show mastery across decks. These bars update based on spaced repetition intervals, integrating backend calculation with frontend Bootstrap-based visualization. This adds a layer of interactivity and feedback that most course projects don’t include.

### 4. **Frontend Interactivity with JavaScript**
The application features rich JavaScript interactions:
- Flashcards flip to reveal answers.
- Buttons toggle visibility dynamically based on user input.
- Cards can be marked correct or incorrect with instant feedback.
- All review logic and dynamic controls are handled via JS without page reloads.

### 5. **User Authentication and Access Control**
Users can create, update, and delete only their own decks and flashcards. Views are decorated with Django’s authentication system to ensure privacy and data separation, which is more than simply using login/logout — it's enforced throughout the application logic.

Taken together, these features constitute a robust and well-rounded application that is distinct in **purpose**, **functionality**, **data modeling**, and **interactivity**.

---

## 📁 Project Structure

```
flashlearn/
├── flashcards/                   # Main app: models, views, forms, templates
│   ├── migrations/
│   ├── templates/flashcards/
│   │   ├── base.html             # Shared layout template
│   │   ├── home.html             # Dashboard with deck stats and progress bars
│   │   ├── study.html            # Interactive flashcard review page
│   │   ├── create_deck.html      # Form for creating a new deck
│   │   ├── create_flashcard.html # Form for adding cards
│   │   ├── confirm_delete.html   # Confirmation for deck deletion
│   ├── models.py                 # Deck, Flashcard, and Profile models
│   ├── views.py                  # All view logic
│   ├── forms.py                  # Django forms for card/deck creation
│   └── urls.py                   # URL patterns for the flashcards app
├── accounts/                     # Django authentication system (register/login)
├── flashlearn_project/
│   ├── settings.py               # Django project settings
│   ├── urls.py                   # Root URLconf
├── db.sqlite3                    # SQLite database
├── manage.py
├── requirements.txt              # Python dependencies
└── README.md                     # Project documentation
```

---

## 🔧 How to Run This Application

1. **Clone the repository:**

```bash
git clone https://github.com/me50/fabianfrankwerner.git (web50/projects/2020/x/capstone branch)
cd flashlearn
```

2. **Create a virtual environment (optional but recommended):**

```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Run migrations:**

```bash
python manage.py migrate
```

5. **Create a superuser (optional):**

```bash
python manage.py createsuperuser
```

6. **Start the development server:**

```bash
python manage.py runserver
```

7. **Open in your browser:**

Visit `http://127.0.0.1:8000/`

---

## ✅ Features Overview

- 🔒 User registration and login
- 📚 Create & manage decks
- ✍️ Add/edit/delete individual flashcards
- 💡 “Show Answer” toggle and smart review flow
- 📈 Daily streak and review tracking per user
- 📅 Spaced repetition-based card scheduling
- 📊 Visual progress bars per deck
- 📱 Mobile responsive UI
- 🔁 Review cycle with correct/incorrect tracking
- 🧹 Secure deck/card deletion with confirmation

---

## 📌 Additional Notes

- The streak and review system uses the `Profile` model to store streak info and the `next_review` and `interval` fields on flashcards to determine scheduling.
- The project is styled using Bootstrap 5 and works on desktop and mobile.
- Flashcard data is stored per-user and never shared between accounts.
- Spaced repetition is simplified but allows easy expansion into more complex scheduling algorithms (like SM2).

---

## 📦 Requirements

Listed in `requirements.txt`:

```text
Django>=5.0
```

Optional (but supported):
- `crispy-forms`
- `widget-tweaks`

---

Thank you for reviewing this project — I hope it demonstrates both my understanding of Django and my attention to thoughtful user experience design.
