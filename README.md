# Fantasy Baseball Auction Assistant

The goal of this project is to create an application that assists a player when drafting in a fantasy baseball auction by performing a combination of useful tasks:

1. Keep track of which players have been drafted, which opposing teams drafted them, and at what price.
2. Visualize remaining players in the auction pool, and their projections / value.
3. Visualize team totals in the 10 ROTO categories.
5. Assemble a team / ensure the players drafted can combined into a legal roster.

The flexibility in a web application should allow further customization than what has been available through traditional spreadsheet tools. 

## TODO: 
- Enable multi-league support, which will require:
	1. A "login" page (no need for serious auth for now.. family use only)
	2. More editability on league settings (# of owners, teams in pool, league rosters, categories, and more)
	3. Postgres rosters table restructuring to accomodate multiple leagues (add leagueid column)
- Edit player notes in the UI
- Settings modal reformat / styling
- "Bid Box" reformat / styling
