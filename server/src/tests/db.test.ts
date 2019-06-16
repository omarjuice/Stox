import expect from 'expect';
import db from '../data/'
import { User, dropTables, createTables } from '../data/'
beforeEach(async () => {
    await dropTables()
    await createTables()
})

describe('DATABASE', () => {
    describe('USER', () => {
        it('Should be able to create a new user', async () => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'ojameer1@gmail.com'
            }
            const user: User = await User.create(newUser)
            expect(user).toBeTruthy()
            expect(user.firstName).toBe(newUser.firstName)
            expect(user.password).toBeFalsy()
            expect(user.email).toBe(newUser.email)
            expect(user.lastName).toBe(newUser.lastName)
        })
        it('Should not allow invalid emails', done => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'bbbbb'
            }
            User.create(newUser)
                .then(() => {
                    done(new Error('Test failed, allowed invalid email'))
                })
                .catch(e => {
                    done()
                })
        })
        it('Should be able to find newly created users', async () => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'ojameer1@gmail.com'
            }
            const user: User = await User.create(newUser)
            const foundUser: User | null = await User.findById(user.id)
            expect(foundUser).toBeTruthy()
            if (foundUser) {
                expect(foundUser.firstName).toBe(newUser.firstName)
                expect(foundUser.lastName).toBe(newUser.lastName)
                expect(foundUser.email).toBe(newUser.email)
            }
        })

    })
})