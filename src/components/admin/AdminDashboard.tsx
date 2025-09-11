
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { UserData } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Users, Clock, ChevronsRight, CheckSquare, Download } from "lucide-react";
import { format } from "date-fns";
import { UserJourneyDetails } from "./UserJourneyDetails";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import * as XLSX from 'xlsx';


export function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserData));
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleExport = () => {
    const flattenedData = users.map(user => {
      const passionsData = user.journeyData?.map(passion => ({
        passionName: passion.name,
        purpose: passion.purpose.map(p => `${p.text} (${p.weight})`).join(', '),
        power: passion.power.map(p => `${p.text} (${p.weight})`).join(', '),
        proof: passion.proof.map(p => `${p.text} (${p.weight})`).join(', '),
        problems: passion.problems.map(p => `${p.text} (${p.weight})`).join(', '),
        possibilities: passion.possibilities.map(p => `${p.text} (${p.weight})`).join(', '),
        suggestedSolutions: passion.suggestedSolutions?.join(', ')
      }));
  
      return {
        ID: user.id,
        Name: user.name,
        Email: user.email,
        WhatsApp: user.whatsapp,
        EducationStatus: user.educationStatus,
        School: user.school,
        Job: user.job,
        RegisteredOn: user.createdAt ? format(user.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : '',
        CurrentStation: user.currentStation,
        ...passionsData?.reduce((acc, p, i) => ({
          ...acc,
          [`Passion ${i+1} Name`]: p.passionName,
          [`Passion ${i+1} Purpose`]: p.purpose,
          [`Passion ${i+1} Power`]: p.power,
          [`Passion ${i+1} Proof`]: p.proof,
          [`Passion ${i+1} Problems`]: p.problems,
          [`Passion ${i+1} Possibilities`]: p.possibilities,
          [`Passion ${i+1} Solutions`]: p.suggestedSolutions,
        }), {})
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "PassionPath_Users.xlsx");
  };

  const stationLabels: Record<string, string> = {
    'user-data': 'User Data Entry',
    'passions': 'Passion Entry',
    'journey': 'Journey In Progress',
    'results': 'Results Calculated'
  };

  const completedUsers = users.filter(u => u.currentStation === 'results').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Journey</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedUsers}</div>
                </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>User Journeys</CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4"/>
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">WhatsApp</TableHead>
                <TableHead className="hidden lg:table-cell">Education</TableHead>
                <TableHead>Current Station</TableHead>
                <TableHead className="hidden lg:table-cell">Registered</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/>{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.whatsapp}</TableCell>
                  <TableCell className="hidden lg:table-cell">{user.educationStatus}</TableCell>
                  <TableCell>{stationLabels[user.currentStation] || user.currentStation}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground"/>
                        {user.createdAt ? format(user.createdAt.toDate(), "PPP") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center text-sm text-primary hover:underline">
                                View <ChevronsRight className="h-4 w-4 ml-1" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <UserJourneyDetails user={user} />
                        </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    