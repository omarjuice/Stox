import { User } from "../data";

export const seedUser: UserSchema.Create = {
    firstName: 'John',
    lastName: 'McMmerphy',
    email: 'coolguy@email.com',
    password: 'password'
}
export default async function seed() {
    const user: User = await User.create(seedUser)

    return user
}