import React, { useEffect, useState } from 'react'
import { createUserSession, retrieveUserSession } from '../repositories/userRepository'
import { TransactionRepository } from '../repositories/transactionRepository'
import { Loader } from '../components/Loader'

export const SignIn = (props: { setTransactionRepository: (transactionRepository: TransactionRepository) => void }): JSX.Element => {
    const [passphrase, setPassphrase] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true)
        retrieveUserSession()
            .then((transactionRepository: TransactionRepository | null): void => {
                transactionRepository && props.setTransactionRepository(transactionRepository)
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
    }, [props])

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        switch (event.target.name) {
            case 'passphrase':
                setPassphrase(event.target.value)
                break
            case 'username':
                setUsername(event.target.value)
                break
        }
    }

    const signIn = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        setIsLoading(true)
        createUserSession(username, passphrase)
            .then((transactionRepository: TransactionRepository): void => {
                props.setTransactionRepository(transactionRepository)
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
    }

    return isLoading
        ? <Loader />
        : (
            <form onSubmit={signIn}>
                <h1>{'S\'identifier'}</h1>
                <label>
                    {'Nom d\'utilisateur'}
                    <input onChange={onInputChange} name="username" type="text" value={username} />
                </label>
                <label>
                    {'Phrase de passe'}
                    <input onChange={onInputChange} name="passphrase" type="password" value={passphrase} />
                </label>
                <input type="submit" value="Valider" />
            </form>
        )
}