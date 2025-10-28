
import curses
import random

def main(stdscr):
    # Initialize curses
    curses.curs_set(0)  # Hide the cursor
    stdscr.nodelay(1)  # Non-blocking input
    stdscr.timeout(100)  # Refresh every 100 ms

    sh, sw = stdscr.getmaxyx()  # Get screen height and width
    
    # Ensure screen is large enough
    if sh < 10 or sw < 20:
        raise Exception(f"Screen too small! Detected: {sh}x{sw}. Please resize your terminal to at least 20x10.")

    # Snake initial position
    snake = [
        [sh // 2, sw // 2 + 1],
        [sh // 2, sw // 2],
        [sh // 2, sw // 2 - 1],
    ]

    # Initial food position
    food = []
    def generate_food():
        while True:
            y = random.randint(1, sh - 2)
            x = random.randint(1, sw - 2)
            if [y, x] not in snake:
                return [y, x]
    
    food = generate_food()

    # Initial direction (right)
    direction = curses.KEY_RIGHT

    score = 0

    while True:
        stdscr.addstr(0, 0, f"Screen: {sh}x{sw}") # Debug: Display screen size
        next_head = [snake[0][0], snake[0][1]]

        # Get user input
        key = stdscr.getch()
        if key == curses.KEY_LEFT and direction != curses.KEY_RIGHT:
            direction = curses.KEY_LEFT
        elif key == curses.KEY_RIGHT and direction != curses.KEY_LEFT:
            direction = curses.KEY_RIGHT
        elif key == curses.KEY_UP and direction != curses.KEY_DOWN:
            direction = curses.KEY_UP
        elif key == curses.KEY_DOWN and direction != curses.KEY_UP:
            direction = curses.KEY_DOWN

        # Update head position based on direction
        if direction == curses.KEY_UP:
            next_head[0] -= 1
        elif direction == curses.KEY_DOWN:
            next_head[0] += 1
        elif direction == curses.KEY_LEFT:
            next_head[1] -= 1
        elif direction == curses.KEY_RIGHT:
            next_head[1] += 1

        # Insert new head
        snake.insert(0, next_head)

        # Check for collisions
        # Wall collision
        if (
            next_head[0] < 1 # Adjusted to avoid top border
            or next_head[0] >= sh - 1 # Adjusted to avoid bottom border
            or next_head[1] < 1 # Adjusted to avoid left border
            or next_head[1] >= sw - 1 # Adjusted to avoid right border
        ):
            break  # Game over

        # Self-collision
        if next_head in snake[1:]:
            break  # Game over

        # Check if snake ate food
        if next_head == food:
            score += 1
            food = generate_food()
        else:
            snake.pop()  # Remove tail if no food eaten

        # Clear screen and redraw
        stdscr.clear()
        
        # Draw borders
        for y in range(sh - 1):
            try:
                stdscr.addch(y, 0, '#')
                stdscr.addch(y, sw - 1, '#')
            except curses.error as e:
                with open("curses_error.log", "a") as f:
                    f.write(f"Error drawing border at ({y}, 0) or ({y}, {sw-1}): {e}\n")
                return # Exit game on critical error

        for x in range(sw - 1):
            try:
                stdscr.addch(0, x, '#')
                stdscr.addch(sh - 1, x, '#')
            except curses.error as e:
                with open("curses_error.log", "a") as f:
                    f.write(f"Error drawing border at ({0}, {x}) or ({sh-1}, {x}): {e}\n")
                return # Exit game on critical error

        # Draw snake
        for y, x in snake:
            try:
                stdscr.addch(y, x, 'o')
            except curses.error as e:
                with open("curses_error.log", "a") as f:
                    f.write(f"Error drawing snake at ({y}, {x}): {e}\n")
                return # Exit game on critical error

        # Draw food
        try:
            stdscr.addch(food[0], food[1], '@')
        except curses.error as e:
            with open("curses_error.log", "a") as f:
                f.write(f"Error drawing food at ({food[0]}, {food[1]}): {e}\n")
            return # Exit game on critical error

        # Display score
        stdscr.addstr(0, 2, f"Score: {score}")

        stdscr.refresh()

    # Game over screen
    stdscr.clear()
    msg = "Game Over!"
    score_msg = f"Final Score: {score}"
    stdscr.addstr(sh // 2 - 1, sw // 2 - len(msg) // 2, msg)
    stdscr.addstr(sh // 2, sw // 2 - len(score_msg) // 2, score_msg)
    stdscr.addstr(sh // 2 + 1, sw // 2 - len("Press any key to exit...") // 2, "Press any key to exit...")
    stdscr.nodelay(0)  # Wait for user input
    stdscr.getch()


if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print("Please ensure your terminal is large enough and supports curses.")
