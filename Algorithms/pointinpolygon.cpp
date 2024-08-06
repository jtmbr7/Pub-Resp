// Author: John Tember
// LiU-ID: johte805
// This algorithm calculates the winding number that a polygon has around a certain
// point. If the point is outside of the polygon, the winding number will be zero,
// otherwise the winding number will be non-zero. I first used the ray-casting algorithm
// but this solution did not seem to be good enough. This may have been because it does not
// work for self-intersecting polygons. The winding number solution works with self intersecting
// polygons and runs in time complexity O(n*e) where n is the number of poitns and e
// is the number of edges. I also do a check first if the point is on any of the edges,
// as this would mean that the point is on the polygon.

#include <iostream>
#include <array>
#include <math.h>


struct Point {
    double x, y;

    double distance(const Point& p) const {
        return std::sqrt(std::pow(x - p.x, 2) + std::pow(y - p.y, 2));
    }

    // point is on line if the distance between the vertices is the same as the summed distance
    // from the point to the vertices
    bool onLine(const Point& v1, const Point& v2) const {
        return (std::abs(distance(v1) + distance(v2) - v1.distance(v2)) < 10e-9);
    }

    Point operator-(const Point& p) const {
        return { x - p.x, y - p.y };
    }

    // dot product
    double operator*(const Point& p) const {
        return x * p.y - y * p.x;
    }
};

int n_vertices, n_points;
std::array<Point, 1001> vertices;
std::array<Point, 100> points;

void calculate_winding_number(int i) {
    const Point& p = points[i];

    int winding_number = 0;
    for (int q = 0; q < n_vertices; ++q) {
        const Point& v1 = vertices[q];
        const Point& v2 = vertices[q + 1];

        if (p.onLine(v1, v2)) {
            std::cout << "on\n";
            return;
        }
        else if (v1.y <= p.y) {
            if (v2.y > p.y && (v2 - v1) * (p - v1) > 0)
                ++winding_number;
        }
        else if (v2.y <= p.y && (v2 - v1) * (p - v1) < 0)
            --winding_number;
    }

    if (winding_number == 0)
        std::cout << "out\n";
    else std::cout << "in\n";
}

int main()
{

    while (true) {

        std::cin >> n_vertices;
        if (n_vertices == 0)
            break;

        for (int i = 0; i < n_vertices; ++i)
            std::cin >> vertices[i].x >> vertices[i].y;

        vertices[n_vertices] = vertices[0];

        std::cin >> n_points;
        for (int i = 0; i < n_points; ++i)
            std::cin >> points[i].x >> points[i].y;

        for (int i = 0; i < n_points; ++i)
            calculate_winding_number(i);



    }
}