import { User } from "../data";

export const seedUser: UserSchema.Create = {
    firstName: 'John',
    lastName: 'McMmerphy',
    email: 'coolguy@email.com',
    password: 'password'
}
export default async function seed() {
    await User.create(seedUser)
}