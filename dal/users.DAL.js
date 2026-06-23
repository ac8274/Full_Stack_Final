const usersDB = []
let latestID = 1

export const UsersDAL = {
    addUser : async (username, email, password) => {
        usersDB.push({
            UID: latestID.toString(),
            Username: `${username}`,
            Email: `${email}`,
            Password: `${password}`
        })
        latestID += 1
        return (latestID-1).toString();
    },
    getUserByUID: async (uid) => {
        const user = usersDB.find((userInfo) => {return userInfo["UID"] === uid})
        return user;
    },
    getUserByUsername: async (username) => {
        const user = usersDB.find((userInfo) => {return userInfo["Username"] === username})
        return user;
    },
    getUserByEmail: async (email) => {
        const user = usersDB.find((userInfo) => {return userInfo["Email"] === email})
        return user;
    }
}