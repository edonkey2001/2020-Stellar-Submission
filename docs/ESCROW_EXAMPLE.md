# Escrow

This is the bread-and-butter example. We will begin with the template:

Escrow.ssct
```
[TEMPLATE]
<PARTY_A: ACCOUNT> </TO>
<PARTY_B: ACCOUNT> </FROM>
<ESCROW_ACCOUNT: NEW_ACCOUNT> </ESCROW_ACCOUNT>
<AMOUNT: NUMBER> </AMOUNT>
<CURRENCY: ASSET> </ASSET>
<PARTY_A_WEIGHT: NUMBER> 1 </PARTY_A_WEIGHT>
<PAY_WEIGHT: NUMBER> 2 </PAY_WEIGHT>

[EXECUTION]
Setup.tx
PARTIAL Payout.tx
TIMED 10000000000 Reimburse.tx
```

Setup.tx
```
First PARTY_A create ESCROW_ACCOUNT.
Then add PARTY_A to ESCROW_ACCOUNT weighted PARTY_A_WEIGHT.
Then threshold-low-change PAY_WEIGHT.
Finally PARTY_A pay ESCROW_ACCOUNT amount AMOUNT of LUMENS.
```

Payout.tx
```
Finally NEW_ACCOUNT pay PARTY_B amount AMOUNT of LUMENS.
```

Reimburse.tx
```
Finally NEW_ACCOUNT pay PARTY_A amount AMOUNT of LUMENS.
```