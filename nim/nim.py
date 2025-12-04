import math
import random


class Nim:
    def __init__(self, initial=[1, 3, 5, 7]):
        """
        Initialize the board with a given configuration.
        By default, the configuration is [1, 3, 5, 7].
        """
        self.piles = initial.copy()
        self.player = 0
        self.winner = None

    @staticmethod
    def available_actions(piles):
        """
        Returns a set of all possible (pile, count) actions.
        An action (pile, count) represents removing `count` items from `pile`.
        """
        actions = set()
        for i, pile in enumerate(piles):
            for count in range(1, pile + 1):
                actions.add((i, count))
        return actions

    @staticmethod
    def switch_player(player):
        return 1 - player

    def move(self, action):
        """
        Make the move for the current player.
        """
        pile, count = action
        if self.piles[pile] < count:
            raise ValueError("Invalid move")
        self.piles[pile] -= count
        self.player = Nim.switch_player(self.player)
        if all(pile == 0 for pile in self.piles):
            self.winner = self.player


class NimAI:
    def __init__(self, alpha=0.5, epsilon=0.1):
        self.q = dict()
        self.alpha = alpha
        self.epsilon = epsilon

    def get_q_value(self, state, action):
        """
        Return the Q-value for the state `state` and the action `action`.
        If no Q-value exists yet in `self.q`, return 0.
        """
        return self.q.get((tuple(state), action), 0)

    def update_q_value(self, state, action, old_q, reward, future_rewards):
        """
        Update the Q-value for the state `state` and the action `action`
        using the Q-learning formula.
        """
        new_value_estimate = reward + future_rewards
        updated_q = old_q + self.alpha * (new_value_estimate - old_q)
        self.q[(tuple(state), action)] = updated_q

    def best_future_reward(self, state):
        """
        Return the best possible reward for the next action in a given state.
        If no actions exist, return 0.
        """
        actions = Nim.available_actions(state)
        if not actions:
            return 0

        max_q = float('-inf')
        for action in actions:
            q = self.get_q_value(state, action)
            if q > max_q:
                max_q = q
        return max_q if max_q != float('-inf') else 0

    def choose_action(self, state, epsilon=True):
        """
        Choose an action to take in the current state.
        With probability self.epsilon, choose a random action.
        Otherwise, choose the best action based on Q-values.
        """
        actions = list(Nim.available_actions(state))

        if not actions:
            return None

        if epsilon and random.random() < self.epsilon:
            return random.choice(actions)

        # Greedy choice
        max_q = float('-inf')
        best_actions = []
        for action in actions:
            q = self.get_q_value(state, action)
            if q > max_q:
                max_q = q
                best_actions = [action]
            elif q == max_q:
                best_actions.append(action)

        return random.choice(best_actions)
