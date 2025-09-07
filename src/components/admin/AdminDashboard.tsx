"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { UserData } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Users, Clock, ChevronsRight } from "lucide-react";
import { format } from "date-fns";
import { UserJourneyDetails } from "./UserJourneyDetails";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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

  const stationLabels: Record<string, string> = {
    'user-data': 'User Data Entry',
    'passions': 'Passion Entry',
    'journey': 'Journey In Progress',
    'results': 'Results Calculated'
  };

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
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>User Journeys</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Current Station</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/>{user.name}</TableCell>
                  <TableCell>{user.whatsapp}</TableCell>
                  <TableCell>{stationLabels[user.currentStation] || user.currentStation}</TableCell>
                  <TableCell>
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
