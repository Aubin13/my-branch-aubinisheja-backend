import { v4 as uuidv4} from 'uuid'
uuidv4()

export const createUser = (req, res) =>{
    const user = req.body;
    const userWithId = { ...user, id: uuidv4()}
    users.push(userWithId);
    res.send('user added!')
}