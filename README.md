# math-sticks
A game using matchsticks to form a seven segment display of numbers. Get the highest possible number by moving the fewest matchsticks.

## Gameplay
The game starts by choosing a random 3 digit number. 
The number can be between 1 and 999 however we left-pad numbers with less than 3 digits, e.g 1 becomes 001 and 25 becomes 025.
The choosen number is displayed as a seven segment number with a matchstick for each segment.

Then the user has 3 moves or less to rearrange the sticks into a valid number that has not previously been given or generated.
Each number submitted makes a round. A round will last 45 seconds and is won when the user submits a valid number as described above.
If the time elapses without a valid number submitted, either because the sticks are invalid or because its a number we have seen before, the game is over

We keep track of users scores, their score is the sum of every number they have generated (ie excluding the initially given number)

The objective is to go as many rounds as possible without losing and accrue as high a score as possible.

## Technology Stack
TypeScript. For both web and api, typescript all through. For shared, game engine code, also typescript.

### Frontend
Use and install the latest versions of all the packages we install.
- React TypeScript
- TailwindCSS
- React Router
