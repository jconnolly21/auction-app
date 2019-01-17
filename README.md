# Fantasy Baseball Auction Assistant

The goal of this project is to create an application that assists a player when drafting in a fantasy baseball auction by performing a combination of useful tasks:

1. Keep track of which players have been drafted, which opposing teams drafted them, and at what price.
2. Visualize remaining players in the auction pool, and their projections / value.
3. Visualize team totals in the 10 ROTO categories.
5. Assemble a team / ensure the players drafted can combined into a legal roster.

The flexibility in a web application should allow further customization than what has been available through traditional spreadsheet tools. 

## TODO: 
- Enable write-back to Postgres:
	- Player --> purchasing team, purchasing amount, roster position filled, draft order (which pick #).
	- Team --> remaining budget.
- Major visual improvements to UI.
- Performance improvements (gets slower as more players are drafted).

Initializing Postgres with Player Data:

``cat ~/Downloads/localfile.csv | \
psql `heroku config:get DATABASE_URL` -c "COPY testonly FROM STDIN WITH (FORMAT CSV);"``

A little manipulation is needed after to massage the data into the right format.