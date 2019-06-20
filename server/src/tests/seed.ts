import { User, dropTables, createTables } from "../data";

export const seedUser: UserSchema.Create = {
    firstName: 'John',
    lastName: 'McMmerphy',
    email: 'coolguy@email.com',
    password: 'password'
}
export default async function seed() {
    await dropTables()
    await createTables()
    const user: User = await User.create(seedUser)

    return user
}