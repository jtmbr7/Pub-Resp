#include <iostream>
#include <vector>
#include <map>
#include <thread>
#include <chrono>
#include <iomanip>
#include <algorithm>
#include <fstream>
#include <sstream>

const double discount_factor = 1, learning_rate = .1;

double random(double a, double b) {
    return a + (b - a) * ((double)std::rand() / (double)RAND_MAX);
}

enum Tile {
    O = -1, U = 0, X = 1
};

struct Cell {
    Tile state = U;

    friend std::ostream& operator<<(std::ostream& os, const Cell& cell) {
        os << (cell.state == U ? " " : (cell.state == O ? "O" : "X"));
        return os;
    }

    friend std::stringstream& operator<<(std::stringstream& ss, const Cell& cell) {
        ss << cell.state;
        return ss;
    }
};

class Board {
public:

    bool operator<(const Board& board) const {

        for (int i = 0; i < 9; ++i)
            if (cells[i].state < board.cells[i].state)
                return true;
            else if (cells[i].state > board.cells[i].state)
                return false;
        return false;
    }

    bool full_line(int a, int b, int c) {
        return (cells[a].state != U && cells[a].state == cells[b].state && cells[a].state == cells[c].state);
    }

    bool strike() {

        for (int i = 0; i < 3; ++i)
            if (full_line(i, i + 3, i + 6) || full_line(i * 3, i * 3 + 1, i * 3 + 2))
                return true;

        if (full_line(0, 4, 8) || full_line(2, 4, 6))
            return true;

        return false;
    }

    bool is_terminal_state() {

        if (strike())
            return true;

        for (const Cell& cell : cells)
            if (cell.state == U)
                return false;
        return true;
    }

    double get_reward() {
        return strike() ? 1 : 0;
    }

    void place_tile(const Tile& tile, const int action) {
        cells[action].state = tile;
    }

    friend std::ostream& operator<<(std::ostream& os, const Board& board) {
        
        int i = 0;
        for (const Cell& cell : board.cells) {
            if (i % 3 == 0)
                os << "|";
            os << cell;
            if (++i % 3 == 0)
                os << "|\n";
            else os << " ";
        }

        os << "\n";
        return os;
    }

    std::string getValues(int i) const {
        return std::to_string(cells[i].state);
    }

    std::string getLine(int i) const {
        return getValues(i * 3) + "," + getValues(i * 3 + 1) + "," + getValues(i * 3 + 2) + ",";
    }

    Cell cells[9];
};

class QTable {
public:

    QTable() {

    }

    QTable(const Board& board) {
        int i = 0;
        for (const Cell& cell : board.cells)
            values[i++] = cell.state == U ? 0.0 : NAN;
    }

    int get_random_action() const {

        std::vector<int> available_actions;
        for (int i = 0; i < 9; ++i)
            if (!std::isnan(values[i]))
                available_actions.push_back(i);

        return available_actions[std::rand() % available_actions.size()];
    }

    int best_action() const {

        int q = get_random_action();
        for (int i = 0; i < 9; ++i)
            if (!std::isnan(values[i]) && values[i] > values[q])
                q = i;
        return q;
    }

    int get_next_action(double epsilon) const {
        if (random(0, 1) < epsilon)
            return get_random_action();
        return best_action();
    }

    double best_q_value() const {

        double best = values[best_action()];
        return best;
    }

    double& operator[](int index) {
        return values[index];
    }

    friend std::ostream& operator<<(std::ostream& os, const QTable& q_table) {

        int i = 0;
        for (const double& value : q_table.values) {
            if (i % 3 == 0)
                os << "|";
            os << std::setw(4) << value;
            if (++i % 3 == 0)
                os << "|\n";
            else os << " ";
        }

        return os;
    }

    void update_q_value(const QTable& q_table, int action, double reward) {
        values[action] += learning_rate * (reward + discount_factor * q_table.best_q_value() - values[action]);
    }

    void update_q_value_end(int action, double reward) {
        values[action] += learning_rate * (reward - values[action]);
    }

    std::string getValues(int i) const {
        return std::isnan(values[i]) ? "NaN" : std::to_string(values[i]);
    }

    std::string getLine(int i) const {
        return getValues(i * 3) + "," + getValues(i * 3 + 1) + "," + getValues(i * 3 + 2) + ",";
    }

    double values[9];
};

class Player {
public:
    const Tile tile;

    Player(Tile _tile) : tile(_tile) {}

    QTable& init_or_get_q_table(const Board& board) {

        auto result = q_values.find(board);
        if (result == q_values.end())
            result = q_values.emplace(board, QTable(board)).first;
        return result->second;  // Return the found or created QTable
    }

    std::map<Board, QTable> q_values;
    QTable* lastTable = nullptr;
    int lastAction = -1;
};

bool play(Board& board, Player* player, bool NPC) {

    int action;

    if (NPC)
        action = player->init_or_get_q_table(board).get_next_action(0);
    else std::cin >> action;

    board.place_tile(player->tile, action);

    std::cout << board;

    if (board.is_terminal_state()) {

        if (board.strike())
            if (NPC)
                std::cout << "Computer Won!!";
            else std::cout << "Player Won!!";

        return false;
    }

    return true;
}

void writeFile(const std::string& fileName, const Player& player) {


    std::vector<std::stringstream> lines(6);

    for (const std::pair<Board, QTable>& p : player.q_values) {
        for (int i = 0; i < 3; ++i) {
            lines[i] << p.first.getLine(i);
            lines[i + 3] << p.second.getLine( i);
        }
    }

    std::ofstream myfile(fileName);

    for (int i = 0; i < 6; ++i)
        myfile << lines[i].str() << "\n";

    myfile.close();

}

int main()
{
    double epsilon = 0.9;
    double epsilon_min = 0.01;
    double epsilon_decay = 0.999991;
    Player player_1(X), player_2(O);
    const int maxEpisodes = 800000, barLength = 50, barValue = maxEpisodes/barLength;

    int win1 = 0, win2 = 0, draw = 0;
    std::vector<double> win1_list, win2_list, draw_list;

    std::cout << std::setfill('-') << std::setw(barLength) << "\n" << std::setfill(' ');
    for (int episode = 0; episode < maxEpisodes; ++episode) {
        
        if (((episode + 1) % barValue) == 0) {
            std::cout << "-";
            if (episode + barValue + 1 == maxEpisodes)
                std::cout << "\n\n";
        }

        Board currentBoard;
        Player* current_player = &player_1;
        Player* other_player = &player_2;

        while (!currentBoard.is_terminal_state()) {

            QTable& q_table = current_player->init_or_get_q_table(currentBoard);

            /*if(episode > maxEpisodes - 30)
                std::cout << currentBoard << "\n" << q_table << "\n";*/

            if (current_player->lastTable != nullptr)
                current_player->lastTable->update_q_value(q_table, current_player->lastAction, currentBoard.get_reward());

            int action = q_table.get_next_action(epsilon);
            currentBoard.place_tile(current_player->tile, action);

            /*if (episode > maxEpisodes - 30)
                if (currentBoard.is_terminal_state())
                    std::cout << currentBoard << "\n";*/

            current_player->lastAction = action;
            current_player->lastTable = &q_table;

            double reward = currentBoard.get_reward();

            if (currentBoard.is_terminal_state()) {

                if (reward == 0)
                    ++draw;
                else if (current_player == &player_1)
                    ++win1;
                else ++win2;

                if (episode % 100 == 0) {
                    draw_list.push_back((double)draw / (episode + 1));
                    win1_list.push_back((double)win1 / (episode + 1));
                    win2_list.push_back((double)win2 / (episode + 1));
                }

                q_table.update_q_value_end(action, reward);
                other_player->lastTable->update_q_value_end(other_player->lastAction, -reward);
            }

            std::swap(current_player, other_player);
            epsilon = std::max(epsilon_min, epsilon * epsilon_decay);
        }
    }
    
    writeFile("player1.csv", player_1);
    writeFile("player2.csv", player_2);

    std::ofstream scoreFile("result.csv");

    for (const double& i : win1_list)
        scoreFile << i << ",";
    scoreFile << "\n";

    for (const double& i : win2_list)
        scoreFile << i << ",";
    scoreFile << "\n";

    for (const double& i : draw_list)
        scoreFile << i << ",";

    scoreFile.close();

    while (true) {
        Board board;
        Player* current_player = &player_1;

        std::cout << board;
        while(play(board, current_player, current_player == &player_2)){
            current_player = (current_player == &player_1 ? &player_2 : &player_1);
        }
    }
}