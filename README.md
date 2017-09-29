# hcp-solver

Solves [Hungry Cat Picross](http://www.tuesdayquest.com/) style puzzles.

```javascript
var solver = require('hcp-solver');

var a = [
        { contiguous: true,  count: 5 },
        { count: 0 }
    ],
    b = [
        { contiguous: true, count: 2 },
        { contiguous: true, count: 3 }
    ],
    solution = solver.solve({
        /*               (2)(2)(2)(5)(5)
         *               (3)(3)(3)      */
        column:          [b, b, b, a, a],
        row:[a, // (5)
             a, // (5)
             b, // (2)(3)
             b, // (2)(3)
             b] // (2)(3)
    });

console.log(solution);
```

Console
```json
[[0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0],
 [1, 1, 1, 0, 0],
 [1, 1, 1, 0, 0],
 [1, 1, 1, 0, 0]]
```
