
##Testing Principals
1. customer requirement
2. it can be shared with 3rd parties in public
3. it should not be exhaustive but needs to check for risk assessment and optimal amount of testing
4. planned properly 

##Types
1. Unit
2. Integration
3. Regression

##Step for Testing
1. Verification - We check for the use case Or set of tasks weather they are implemented properly in a function
E.g: Are we building the product right?

2. Validation - Set of tasks to make our app traceable to customers requirement.
E.g: Are we building the right product?


##Testing techniques 
1. Black Box - Source code is not available
2. White Box - Source code is available

                0                   --> Acceptance tests
            0       0
        0               0           --> Integration tests
    0                       0
0  0    0   0   0   0   0   0   0   --> Unit tests


Testing Frameworks
1. jest
2. mocha - testing environment and use your favorite assertion library to write the test cases

Assertion Library
1. chai - different styles to test e.g. should, expect, asset
2. chai-http - used to test the API endpoints
