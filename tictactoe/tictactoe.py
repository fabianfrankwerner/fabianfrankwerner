"""
Tic Tac Toe Player
"""

import math
import copy

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    # Count the number of X's and O's
    x_count = sum(row.count(X) for row in board)
    o_count = sum(row.count(O) for row in board)

    # If X and O have same count, X goes (X starts the game)
    # Otherwise, O goes
    return X if x_count <= o_count else O


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    possible_actions = set()

    # Check each cell on the board
    for i in range(3):
        for j in range(3):
            # If cell is empty, it's a valid action
            if board[i][j] == EMPTY:
                possible_actions.add((i, j))

    return possible_actions


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    # Check if action is valid
    if action not in actions(board):
        raise Exception("Invalid action")

    # Make a deep copy of the board to avoid modifying original
    new_board = copy.deepcopy(board)

    # Get current player
    current_player = player(board)

    # Make the move
    i, j = action
    new_board[i][j] = current_player

    return new_board


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    # Check rows
    for row in board:
        if row == [X, X, X]:
            return X
        if row == [O, O, O]:
            return O

    # Check columns
    for j in range(3):
        if board[0][j] == board[1][j] == board[2][j] == X:
            return X
        if board[0][j] == board[1][j] == board[2][j] == O:
            return O

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] == X:
        return X
    if board[0][0] == board[1][1] == board[2][2] == O:
        return O
    if board[0][2] == board[1][1] == board[2][0] == X:
        return X
    if board[0][2] == board[1][1] == board[2][0] == O:
        return O

    # No winner
    return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    # Check if there's a winner
    if winner(board) is not None:
        return True

    # Check if the board is full (no EMPTY cells)
    for row in board:
        if EMPTY in row:
            return False

    # Board is full with no winner (tie)
    return True


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    # Check winner
    win = winner(board)

    if win == X:
        return 1
    elif win == O:
        return -1
    else:
        return 0


def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    # If the board is terminal, return None
    if terminal(board):
        return None

    current_player = player(board)

    # If current player is X (maximizing player)
    if current_player == X:
        best_val = float('-inf')
        best_action = None

        # For each possible action
        for action in actions(board):
            # Get the min value from the resulting board
            val = min_value(result(board, action))

            # Update best value and action if this move is better
            if val > best_val:
                best_val = val
                best_action = action

        return best_action

    # If current player is O (minimizing player)
    else:
        best_val = float('inf')
        best_action = None

        # For each possible action
        for action in actions(board):
            # Get the max value from the resulting board
            val = max_value(result(board, action))

            # Update best value and action if this move is better
            if val < best_val:
                best_val = val
                best_action = action

        return best_action


def max_value(board):
    """
    Returns the maximum utility value possible from a board.
    Helper function for minimax.
    """
    # If the board is terminal, return its utility
    if terminal(board):
        return utility(board)

    # Initialize value to negative infinity
    v = float('-inf')

    # For each possible action
    for action in actions(board):
        # Get the minimum value from the resulting board
        v = max(v, min_value(result(board, action)))

    return v


def min_value(board):
    """
    Returns the minimum utility value possible from a board.
    Helper function for minimax.
    """
    # If the board is terminal, return its utility
    if terminal(board):
        return utility(board)

    # Initialize value to positive infinity
    v = float('inf')

    # For each possible action
    for action in actions(board):
        # Get the maximum value from the resulting board
        v = min(v, max_value(result(board, action)))

    return v
