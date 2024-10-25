import { useEffect, useState } from 'react';

import * as React from 'react';

import './App.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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

  function deposit(id: number, amount: number) {
    const updatedAccounts = accounts.map(account => {
      if (account.id === id) {
        account.balance += amount;
      }
      return account;
    });
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  function withdraw(id: number, amount: number) {
    const updatedAccounts = accounts.map(account => {
      if (account.id === id) {
        if (account.balance >= amount) {
          account.balance -= amount;
        } else {
          alert("Saldo insuficiente!");
        }
      }
      return account;
    });
    setAccounts(updatedAccounts);
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
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="box-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <h2>fdsfdgfdg</h2>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      
      

      {accounts.map((account) => (
        <section key={account.id}>
          <span>{account.nameBank} - {account.agency} - {account.account} - Saldo: R$ {account.balance}</span>
          <button onClick={() => handleDelete(account.id)}>Remover</button>
          <button onClick={() => handleEdit(account)}>Editar</button>
          <button onClick={() => deposit(account.id, 100)}>Depositar R$ 100</button>
          <button onClick={() => withdraw(account.id, 50)}>Sacar R$ 50</button>
        </section>
      ))}
    </div>
  );
}

export default App;
