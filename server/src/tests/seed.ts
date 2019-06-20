import { User, dropTables, createTables } from "../data";

export const seedUser: UserSchema.Create = {
    firstName: 'Omar',
    lastName: 'Jameer',
    email: 'ojameer1@gmail.com',
    password: '123',
    balance: 5000
}
export default async function seed() {
    await dropTables()
    await createTables()
    const user: User = await User.create(seedUser)

    return user
}