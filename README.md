# Fantasy Baseball Auction Assistant

The goal of this project is to create an application that assists a player when drafting in a fantasy baseball auction by performing a combination of useful tasks:

1. Keep track of which players have been drafted, which opposing teams drafted them, and at what price.
2. Visualize remaining players in the auction pool, and their projections / value.
3. Visualize team totals in the 10 ROTO categories.
4. Allow fuzzy searching for player names (because spelling is hard).
5. Assemble a team / ensure the players drafted can combined into a legal roster.

The flexibility in a web application should allow further customization than what has been available through traditional spreadsheet tools. 

## TODO: 
- Populate Postgres with production-scale player data.
- Enable write-back to Postgres:
	- Player --> purchasing team, purchasing amount, roster position filled, draft order (which pick #).
	- Team --> remaining budget.
- Major visual improvements to UI.