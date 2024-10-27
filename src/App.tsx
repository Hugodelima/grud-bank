import { useEffect, useState } from 'react';

import * as React from 'react';

import './App.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

interface Account {
  id: number | undefined;
  nameBank: string;
  agency: number;
  account: number;
  balance: number;
}

function App() {
  const [nameBank, setNameBank] = useState('');
  const [numberAgency, setNumberAgency] = useState('');
  const [numberAccount, setNumberAccount] = useState('');
  const [numberBalance, setNumberBalance] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editMode, setEditMode] = useState<{ enabled: boolean; account: Account | null }>({
    enabled: false,
    account: null,
  });
  const [numberModal, setNumberModal] = useState('')

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  function handleRegister() {
    if (!nameBank || !numberAgency || !numberAccount || !numberBalance) {
      alert('Por favor, preencha todos os campos solicitados')
      return;
    }

    const newAccount: Account = {
      id: (editMode.enabled ? editMode.account?.id : Date.now()),
      nameBank,
      agency: parseInt(numberAgency),
      account: parseInt(numberAccount),
      balance: parseFloat(numberBalance),
    };

    if (editMode.enabled && editMode.account) {
      handleSaveEdit(newAccount);
      return;
    }

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    resetForm();
  }

  function handleDelete(id: number | undefined) {
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  function handleEdit(account: Account) {
    setNameBank(account.nameBank);
    setNumberAgency(account.agency);
    setNumberAccount(account.account);
    setNumberBalance(account.balance);
    setEditMode({ enabled: true, account });
  }

  function handleSaveEdit(updatedAccount: Account) {
    const updatedAccounts = accounts.map(account => (account.id === updatedAccount.id ? updatedAccount : account));
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    resetForm();
  }

  function resetForm() {
    setNameBank('')
    setNumberAgency('')
    setNumberAccount('')
    setNumberBalance('')
    setEditMode({ enabled: false, account: null })
  }

  function deposit(id: number, amount: string) {
    if(!numberModal) {
      alert("Por favor, preencha todos os campos")
      return
    }
    
    const updatedAccounts = accounts.map(account => {
      account.balance = parseFloat(account.balance)
      if (account.id === id) {
        account.balance += parseFloat(amount);
      }
      return account;
    });
    setAccounts(updatedAccounts);
    setNumberModal('')
    setOpen(false)
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    alert(`Foi depositado com sucesso no valor de: ${amount}`)
  }

  function withdraw(id: number, amount: number) {
    if(!numberModal) {
      alert("Por favor, preencha todos os campos")
      return
    }
    const updatedAccounts = accounts.map(account => {
      
      if (account.id === id) {

        account.balance = parseFloat(account.balance)

        if (account.balance >= amount) {

          account.balance -= parseFloat(amount);
          alert(`Foi sacado com sucesso no valor de: ${amount}`)

        } else {
          alert("Saldo insuficiente!");
        }
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setNumberModal('')
    setOpen(false)
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  return (
    <div>

      <h1>Gerenciamento de Conta Bancária</h1>

      <input
        type="text"
        value={nameBank}
        onChange={(e) => setNameBank(e.target.value)}
        placeholder="Nome do banco"
      />

      <input
        type="number"
        value={numberAgency}
        onChange={(e) => setNumberAgency(e.target.value)}
        placeholder="Número da Agência"
      />

      <input
        type="number"
        value={numberAccount}
        onChange={(e) => setNumberAccount(e.target.value)}
        placeholder="Número da Conta"
      />

      <input
        type="number"
        value={numberBalance}
        onChange={(e) => setNumberBalance(e.target.value)}
        placeholder="Digite o saldo"
      />

      <button onClick={handleRegister}>
        {editMode.enabled ? 'Alterar Conta' : 'Cadastrar Conta'}
      </button>

      <hr />
      
      
      
      

      {accounts.map((account) => (
        <section key={account.id}>
          <span>{account.nameBank} - {account.agency} - {account.account} - Saldo: R$ {account.balance}</span>
          <button onClick={() => handleDelete(account.id)}>Remover</button>
          <button onClick={() => handleEdit(account)}>Editar</button>
          <button onClick={handleOpen}>Abrir Tela de Movimentação Bancária</button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="box-modal">
              <h1>Tela de Movimentação Bancária</h1>
              <input
                type="number"
                value={numberModal}
                onChange={(e) => setNumberModal(e.target.value)}
                placeholder="Digite um valor"
              />
              {/* @ts-ignore */}
              <button onClick={() => deposit(account.id, numberModal)}>Depositar</button>
              {/* @ts-ignore */}
              <button onClick={() => withdraw(account.id, numberModal)}>Sacar</button>

              <button onClick={() => setOpen(false)}>Sair</button>
            </Box>
          </Modal>
        </section>
      ))}
    </div>
  );
}

export default App;
