'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  DollarSign,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCcw,
  Trash,
} from 'lucide-react';
import * as React from 'react';

import { Label } from '@radix-ui/react-label';
import { useEffect, useRef, useState } from 'react';
import {
  addUniqueAccounts,
  generateAccount,
  readValidAccount,
} from '../../lib/account';
import { readFile, updateFile } from '../../lib/file';
import { accountLogin } from '../../lib/login';
import useAccountStore from '../../store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';

export const AccountTable: React.FC<any> = ({ accountType }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [dataTable, setDataTable] = useState<any>([]);
  const [isDialogAddAccountOpen, setDialogAddAccountOpen] = useState(false);
  const [isDialogProxyOpen, setDialogProxyOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<any>();
  const [errorAddProxy, setErrorAddProxy] = useState<any>();
  const [useAuthForProxy, setUseAuthForProxy] = useState(false);

  const { accounts, updateAccount, addAccount, removeAccount } =
    useAccountStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const proxyRef = useRef<HTMLInputElement>(null);
  const portRef = useRef<HTMLInputElement>(null);
  const authUsernameRef = useRef<HTMLInputElement>(null);
  const authPasswordRef = useRef<HTMLInputElement>(null);

  const handleAddAccount = () => {
    if (usernameRef.current && passwordRef.current) {
      const newAccount = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
      addAccount(accountType, generateAccount(newAccount));
      setDialogAddAccountOpen(false);
    }
  };
  const handleAddProxy = (row: any) => {
    if (!proxyRef.current?.value) {
      setErrorAddProxy('Please input proxy');
      return;
    }
    if (!portRef.current?.value) {
      setErrorAddProxy('Please input port');
      return;
    }

    if (proxyRef.current && portRef.current && row) {
      const newProxy = {
        proxy: proxyRef.current.value,
        port: portRef.current.value,
        userProxy: useAuthForProxy ? authUsernameRef.current?.value : '',
        passProxy: useAuthForProxy ? authPasswordRef.current?.value : '',
      };
      updateAccount(accountType, row.username, newProxy);
      setDialogProxyOpen(false);
    }
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const text = e.target.result;
      const newAccounts = readValidAccount(text);
      addUniqueAccounts(newAccounts, accounts, accountType, addAccount);
    };
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: `Failed to read file`,
      });
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleReadFile = (data: any, accountTypeReceived: any) => {
      if (accountTypeReceived == accountType) {
        const newAccounts = readValidAccount(data);
        if (newAccounts.length > 0) {
          newAccounts.map(async (account: any) => {
            if (account?.username) {
              try {
                addAccount(accountType, generateAccount(account));
              } catch (err) {
                console.error('Setup bot failed:', err);
              }
            }
          });
        }
      }
    };
    window.backend.on('read-file', handleReadFile);

    return () => {
      window.backend.removeListener('read-file', handleReadFile);
    };
  }, []);

  useEffect(() => {
    readFile(accountType);
  }, []);

  useEffect(() => {
    if (accounts[accountType]) {
      setDataTable(accounts[accountType]);
      updateFile(accounts[accountType], accountType);
    }
  }, [accounts]);

  const handleDeleteRow = (rowData: any) => {
    removeAccount(accountType, rowData.username);
  };

  const checkBalance = async (rowData: any) => {
    var mainBalance = rowData.main_balance;

    const data = (await accountLogin(rowData)) as any;
    const cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
    mainBalance = cash;

    updateAccount(accountType, rowData.username, {
      main_balance: mainBalance,
    });
  };

  const handleDeleteSelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row: any) => {
      removeAccount(accountType, row.original.username);
    });
    toast({
      title: 'Deleted accounts',
      description: `${selectedRows.length} account(s) deleted.`,
    });
  };

  const refreshAccount = () => {
    readFile(accountType);
    toast({
      title: 'Refreshed ',
      description: `Table refreshed`,
    });
  };

  const columns: ColumnDef<unknown, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="bg-white"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          className="!border-[#fff] !border"
          style={{ background: '#fff' }}
          checked={row?.original.isSelected || row.getIsSelected()}
          onCheckedChange={async (value) => {
            row.toggleSelected(!!value);
            var mainBalance = row.original.main_balance;
            if (value) {
              const data = (await accountLogin(row.original)) as any;
              const cash = Array.isArray(data?.data)
                ? data?.data[0].main_balance
                : 0;
              mainBalance = cash;
            }

            updateAccount(accountType, row?.original.username, {
              isSelected: value,
              main_balance: mainBalance,
            });
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'password',
      header: () => <div className="text-center">Password</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium px-0">
            {row.getValue('password')}
          </div>
        );
      },
    },
    {
      accessorKey: 'main_balance',
      header: ({ column }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <DollarSign className="h-4 w-4" />
            Cash
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="lowercase flex flex-row justify-center items-center">
            {row.getValue('main_balance')}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => checkBalance(rowData)}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1000]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteRow(rowData)}>
                Delete account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => checkBalance(rowData)}>
                Check balance
              </DropdownMenuItem>
              {accountType == 'MAIN' && (
                <DropdownMenuItem
                  onClick={() => {
                    setDialogProxyOpen(true);
                    setRowSelected(rowData);
                  }}
                >
                  Set proxy
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const cashIndex = columns.findIndex(
    (col: any) => col.accessorKey === 'main_balance'
  );

  if (accountType === 'MAIN') {
    columns.splice(cashIndex + 1, 0, {
      accessorKey: 'proxy',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 truncate"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Proxy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue('proxy')}</div>;
      },
    });
  }

  const table = useReactTable({
    data: dataTable,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter username..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event: { target: { value: any } }) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex flex-row justify-end items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <Paperclip className="size-4" />
              </Button>
            </TooltipTrigger>
            <Dialog
              open={isDialogAddAccountOpen}
              onOpenChange={setDialogAddAccountOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogAddAccountOpen(true)}
                >
                  <Plus className="size-4" />
                  <span className="sr-only">Add account</span>
                </Button>
              </DialogTrigger>
            </Dialog>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteSelectedRows}
              >
                <Trash className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={refreshAccount}>
                <RefreshCcw className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="px-0"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center px-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center p-3 pt-0">
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
      <Dialog open={isDialogProxyOpen} onOpenChange={setDialogProxyOpen}>
        <DialogContent>
          <DialogTitle>Add proxy</DialogTitle>
          <DialogDescription className={`${errorAddProxy && 'text-red-500'}`}>
            {errorAddProxy
              ? errorAddProxy
              : 'Enter the details of the new proxy.'}
          </DialogDescription>
          <Input ref={proxyRef} placeholder="Proxy" className="mb-4" />
          <Input
            ref={portRef}
            type="password"
            placeholder="Port"
            className="mb-4"
          />
          <div className="flex flex-row items-center justify-start gap-2">
            <Checkbox
              className="bg-white"
              checked={useAuthForProxy}
              onCheckedChange={() => setUseAuthForProxy(!useAuthForProxy)}
            />
            <Label>Is use authentication ?</Label>
          </div>

          {useAuthForProxy && (
            <>
              <Input
                ref={authUsernameRef}
                placeholder="Username for Proxy"
                className="mb-4"
              />
              <Input
                ref={authPasswordRef}
                type="password"
                placeholder="Password for Proxy"
                className="mb-4"
              />
            </>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setDialogProxyOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => handleAddProxy(rowSelected)}>
              Set proxy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDialogAddAccountOpen}
        onOpenChange={setDialogAddAccountOpen}
      >
        <DialogContent>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Enter the details of the new account.
          </DialogDescription>
          <Input ref={usernameRef} placeholder="Username" className="mb-4" />
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="mb-4"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setDialogAddAccountOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
