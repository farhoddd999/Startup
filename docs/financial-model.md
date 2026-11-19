# Financial model: notes

The model is in [`Hearth-financial-model.xlsx`](./Hearth-financial-model.xlsx). Every output is a formula driven by the **Assumptions** sheet. Blue cells are inputs, yellow cells are key assumptions, green cells link to another sheet. Change an input and the model recalculates.

## Sheets

| Sheet | What it shows |
|---|---|
| Assumptions | Families, price, discounts, grants, cost to serve, hiring plan and salaries, other costs, funding |
| Model | Five-year P&L and cash: families, revenue, cost of service, gross margin, operating costs, EBITDA, cash, runway |
| Unit economics | Price vs. cost to serve, acquisition cost per new family, payback, lifetime value vs. acquisition cost |
| Market | U.S. TAM and SAM with sources and labeled assumptions; global context |
| Use of funds | The pre-seed split and the runway it buys |

## Base case (as built)

| | Y1 2027 | Y2 2028 | Y3 2029 | Y4 2030 | Y5 2031 |
|---|---:|---:|---:|---:|---:|
| Families enrolled (end of year) | 1,000 | 6,000 | 25,000 | 70,000 | 150,000 |
| Total revenue | $0.16M | $0.47M | $1.24M | $2.81M | $6.04M |
| Gross margin on program revenue | 72% | 91% | 93% | 93% | 94% |
| Team (FTE) | 3.5 | 8.5 | 14 | 21.5 | 28 |
| EBITDA | −$0.66M | −$1.39M | −$1.96M | −$2.09M | −$0.70M |
| Equity raised | $1.5M | $5.0M | – | $8.0M | – |
| Closing cash | $0.84M | $4.46M | $2.50M | $8.41M | $7.71M |
| Acquisition cost per new family | $184 | $96 | $52 | $35 | $29 |
| Lifetime contribution ÷ acquisition cost | 0.7× | 1.4× | 2.6× | 3.7× | 4.5× |

Revenue includes grants and philanthropy (a modest, declining share). The pre-seed buys about **20 months** at the planned burn.

## What drives the model

1. **Families enrolled** (contracts won). The Y5 plan is about 11% of the families reachable through today's channels (Market sheet).
2. **Price realized** after volume discounts ($60 list, ~$55 realized in Y5).
3. **Acquisition cost per family**, which falls as programs run launches themselves with train-the-trainer kits. This is the assumption most worth testing: if it stays near pilot levels ($100 per family), lifetime value never covers acquisition and the plan must lean on larger contracts (states, health plans).
4. **Cost to serve** (~$5 per family in Y1, falling as stories are reused). AI cost is small because most nights use the shared library and speech runs on the phone.

## Known simplifications

- Operating cash flow ≈ EBITDA (no capex, working capital, taxes, or payment timing).
- Contracts are annual, and revenue is spread evenly across the year.
- No churn of partner contracts is modeled; family retention (2.5 years) is used only in lifetime value.
- Salaries are U.S. averages for an early-stage startup; adjust for location.
