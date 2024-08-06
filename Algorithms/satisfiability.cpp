#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <set>

struct Variable {

	Variable(int _i, bool _negative) : i(_i), negative(_negative) {

	}

	int operator()(const std::vector<int>& variables) const {

		if (variables[i] == 0)
			return 0;

		bool b = variables[i] == 1;
		if (negative)
			b = !b;

		return b ? 1 : -1;
	}

	const int i;
	const bool negative;
};

struct Clause {
	std::vector<Variable> variables;
};


bool run(const std::vector<Clause>& clauses, std::vector<int> variables) {

	for (const Clause& c : clauses) {
		bool check = true;

		for (const Variable& v : c.variables) {
			int value = v(variables);

			if (value == 1 || value == 0)
				check = false;
		}

		if (check)
			return false;
	}

	bool satisfied = true;
	for(const Clause& c : clauses) {
		bool check = false;
		for (const Variable& v : c.variables)
			if (v(variables) == 1)
				check = true;

		if (!check)
			satisfied = false;
	}

	if (satisfied)
		return true;


	for (int i = 0; i < variables.size(); ++i)
		if (variables[i] == 0) {
			variables[i] = 1;
			bool assign_true = run(clauses, variables);
			variables[i] = -1;
			bool assign_false = run(clauses, variables);
			return (assign_true || assign_false);
		}
}

int main() {
	int n_queries;
	std::cin >> n_queries;

	for (int i = 0; i < n_queries; ++i) {

		int n_variables, n_clauses;
		std::cin >> n_variables >> n_clauses >> std::ws;
		std::vector<Clause> clauses(n_clauses);
		std::vector<int> variables(n_variables);

		std::string line;
		for (int q = 0; q < n_clauses; ++q) {
			std::getline(std::cin, line);
			std::stringstream ss{ line };

			while (ss >> line) {

				bool negated = line[0] == '~';
				clauses[q].variables.push_back({ std::stoi(negated ? line.substr(2) : line.substr(1)) - 1, negated });

				ss >> line;
			}
		}

		std::cout << (run(clauses, variables) ? "satisfiable\n" : "unsatisfiable\n");
	}
}