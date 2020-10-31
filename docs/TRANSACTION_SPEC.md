# Transaction Specification

A transaction is a high-level representation of a series of operations. In order to make it simpler to read and thus verify for correctness, an operation is defined in a sentence like manner with verbs and nouns.

**Noun**: A noun is a template free variable.

**Verb**: an action or connecting word.

Verbs:
* pay
* of
* amount
* create
* add
* to
* weighted
* threshold-low-change
* threshold-medium-change
* threshold-high-change

Transition Verbs:
* First
* Then
* Finally

**Sentence:** a predefined sequence of nouns and verbs.

Sentences:
* Payment: _ pay _ amount _ of _.
* Asset/Account Creation: _ create _.
* Add Signer: add _ to _ weighted _.
* Change Threshold: _ threshold-_-change _.


Examples:

**Simple Payment:**

```
Finally FROM pay TO amount AMOUNT of CURRENCY.
```

**Create New Account:**

```
Finally TO create NEW_ACCOUNT.
```

**Escrow:**

```
Setup.tx
---------------------------------------------------------
First create NEW_ACCOUNT.
Finally PERSON_A pay NEW_ACCOUNT amount AMOUNT of LUMENS.

Option1.tx
---------------------------------------------------------
NEW_ACCOUNT pay PERSON_A amount AMOUNT of LUMENS.

Option2.tx
---------------------------------------------------------
NEW_ACCOUNT pay PERSON_A amount AMOUNT of LUMENS.
```