<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\BookCollection;
use App\Http\Resources\BookDetailResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('authors');

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('status')) {
            $query->filterByStatus($request->status);
        }

        if ($request->has('language')) {
            $query->filterByLanguage($request->language);
        }

        if ($request->has('author_id')) {
            $query->filterByAuthor($request->author_id);
        }

        if ($request->has('year')) {
            $query->filterByYear($request->year);
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'title':
                    $query->orderBy('title');
                    break;
                case 'publication_date':
                    $query->orderBy('publication_date', 'desc');
                    break;
                case 'created_at':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $books = $query->paginate($perPage);

        return new BookCollection($books);
    }

    public function store(StoreBookRequest $request): JsonResponse
    {
        $data = $request->validated();
        $authors = $data['authors'];
        unset($data['authors']);

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $this->uploadCover($request->file('cover'));
        }

        $book = Book::create($data);

        $this->syncAuthorsData($book, $authors);

        $book->load('authors');

        return response()->json(new BookResource($book), 201);
    }

    public function show($slug)
    {
        $book = Book::with('authors')->where('slug', $slug)->firstOrFail();
        return new BookResource($book);
    }

    public function showDetail($slug)
    {
        $book = Book::with(['authors', 'activePurchaseTypes', 'validPromotions'])
            ->where('slug', $slug)
            ->firstOrFail();
        return new BookDetailResource($book);
    }

    public function showAdmin(Book $book)
    {
        $book->load('authors');
        return new BookResource($book);
    }

    public function update(UpdateBookRequest $request, Book $book): JsonResponse
    {
        $data = $request->validated();
        $authors = $data['authors'];
        unset($data['authors']);

        if ($request->hasFile('cover')) {
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            $data['cover_path'] = $this->uploadCover($request->file('cover'));
        }

        $book->update($data);

        $this->syncAuthorsData($book, $authors);

        $book->load('authors');

        return response()->json(new BookResource($book));
    }

    public function destroy(Book $book): JsonResponse
    {
        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function storeCover(Request $request, Book $book): JsonResponse
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120'
        ]);

        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $coverPath = $this->uploadCover($request->file('cover'));
        $book->update(['cover_path' => $coverPath]);

        return response()->json([
            'cover_url' => $book->cover_url,
            'message' => 'Cover uploaded successfully'
        ]);
    }

    public function deleteCover(Book $book): JsonResponse
    {
        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
            $book->update(['cover_path' => null]);
        }

        return response()->json(['message' => 'Cover deleted successfully']);
    }

    private function uploadCover($file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('books', $filename, 'public');
    }

    public function attachAuthors(Request $request, Book $book): JsonResponse
    {
        $request->validate([
            'authors' => 'required|array|min:1',
            'authors.*.id' => 'required|exists:authors,id',
            'authors.*.contribution_role' => 'nullable|string|max:60',
            'authors.*.contribution_order' => 'nullable|integer|min:1',
        ]);

        $attachData = [];
        foreach ($request->authors as $author) {
            $attachData[$author['id']] = [
                'contribution_role' => $author['contribution_role'] ?? 'Author',
                'contribution_order' => $author['contribution_order'] ?? 1,
            ];
        }

        $book->authors()->attach($attachData);
        $book->load('authors');

        return response()->json(new BookResource($book));
    }

    public function syncAuthors(Request $request, Book $book): JsonResponse
    {
        $request->validate([
            'authors' => 'required|array|min:1',
            'authors.*.id' => 'required|exists:authors,id',
            'authors.*.contribution_role' => 'nullable|string|max:60',
            'authors.*.contribution_order' => 'nullable|integer|min:1',
        ]);

        $this->syncAuthorsData($book, $request->authors);
        $book->load('authors');

        return response()->json(new BookResource($book));
    }

    public function detachAuthor(Book $book, $authorId): JsonResponse
    {
        $book->authors()->detach($authorId);
        $book->load('authors');

        return response()->json(new BookResource($book));
    }

    private function syncAuthorsData(Book $book, array $authors): void
    {
        $syncData = [];
        foreach ($authors as $author) {
            $syncData[$author['id']] = [
                'contribution_role' => $author['contribution_role'] ?? 'Author',
                'contribution_order' => $author['contribution_order'] ?? 1,
            ];
        }
        $book->authors()->sync($syncData);
    }
}