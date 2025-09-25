<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $totalAuthors = Author::count();
        $totalBooks = Book::count();

        $booksByStatus = [
            'draft' => Book::where('status', 'draft')->count(),
            'published' => Book::where('status', 'published')->count(),
        ];

        return response()->json([
            'total_authors' => $totalAuthors,
            'total_books' => $totalBooks,
            'books_by_status' => $booksByStatus,
        ]);
    }
}