#include <iostream>
#include <algorithm>
#include <vector>

const int width = 11, height = 11;
int q_values[width][height][4];
int rewards0[width][height]{
    {-100, -100, -100, -100, -100,  100, -100, -100, -100, -100, -100},
    {-100,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1, -100},
    {-100,   -1, -100, -100, -100, -100, -100,   -1, -100,   -1, -100},
    {-100,   -1,   -1,   -1,   -1,   -1,   -1,   -1, -100,   -1, -100},
    {-100, -100, -100,   -1, -100, -100, -100,   -1, -100, -100, -100},
    {  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1},
    {-100, -100, -100, -100, -100,   -1, -100, -100, -100, -100, -100},
    {-100,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1, -100},
    {-100, -100, -100,   -1, -100, -100, -100,   -1, -100, -100, -100},
    {  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1},
    {-100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100}
};

int rewards[width][height]{
};

struct Position {
    int x = 0, y = 0;
};

double random(double a, double b) {
    return a + (b - a) * ((double)std::rand() / (double)RAND_MAX);
}

bool is_terminal_state(Position p) {
    return rewards[p.x][p.y] != -1;
}

Position get_starting_location() {

    Position p;

    do p.x = std::rand() % width, p.y = std::rand() % height;
    while (is_terminal_state(p));

    return p;
}

int best_action(Position p) {

    int q = 0;
    for (int i = 0; i < 4; ++i)
        if (q_values[p.x][p.y][i] > q_values[p.x][p.y][q])
            q = i;
    return q;
}

int get_next_action(Position p, double epsilon) {
    if (random(0, 1) < epsilon)
        return best_action(p);
    return std::rand() % 4;
}

Position get_next_location(Position p, int action) {

    switch (action) {
        case 0: if(p.y > 0) --p.y; break;
        case 1: if(p.x < width - 1) ++p.x; break;
        case 2: if(p.y < height - 1) ++p.y; break;
        case 3: if(p.x > 0) --p.x; break;
    }

    return p;
}

std::vector<Position> get_shortest_path(Position p) {
    if (is_terminal_state(p))
        return {};

    std::vector<Position> shortest_path;
    shortest_path.push_back(p);

    while (!is_terminal_state(p)) {
        int action_index = get_next_action(p, 1);
        p = get_next_location(p, action_index);
        shortest_path.push_back(p);
    }

    return shortest_path;
}

void print_path(const std::vector<Position>& path) {

    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {

            bool found = false;
            for (const Position& p : path)
                if (p.x == x && p.y == y)
                    found = true;

            std::cout << (found ? "o" : (rewards[x][y] == -100 ? "#" : " "));
        }
        std::cout << "\n";
    }
    std::cout << "\n\n";
}

int main()
{

    for (int x = 0; x < width; ++x)
        for (int y = 0; y < height; ++y)
            rewards[x][y] = rewards0[y][x];

    for (int x = 0; x < width; ++x)
        for (int y = 0; y < height; ++y)
            for (int i = 0; i < 4; ++i)
                q_values[x][y][i] = 0;


    double epsilon = .9, discound_factor = .9, learning_rate = .9;


    for (int episode = 0; episode < 6000; ++episode) {
        std::cout << episode << "\n";
        Position p = get_starting_location();

        while (!is_terminal_state(p)) {
            int action_index = get_next_action(p, epsilon);

            Position oldP = p;

            p = get_next_location(p, action_index);

            double reward = rewards[p.x][p.y];

            double old_q_value = q_values[oldP.x][oldP.y][action_index];
            double temporal_difference = reward + (discound_factor * q_values[p.x][p.y][best_action(p)]) - old_q_value;

            double new_q_value = old_q_value + (learning_rate * temporal_difference);
            q_values[oldP.x][oldP.y][action_index] = new_q_value;
        }
    }

    std::cout << "Training complete!\n";

    for (int x = 0; x < width; ++x)
        for (int y = 0; y < height; ++y) {
            if (is_terminal_state({ x,y }))
                continue;

            Position start_p{ x, y };
            std::vector<Position> shortest_path = get_shortest_path(start_p);
            if(shortest_path.back().x != 5 && (shortest_path.back().y != 0))
                print_path(shortest_path);
        }

}
