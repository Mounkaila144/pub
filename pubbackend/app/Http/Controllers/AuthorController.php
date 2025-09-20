<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Http\Requests\StoreAuthorRequest;
use App\Http\Requests\UpdateAuthorRequest;
use App\Http\Resources\AuthorResource;
use App\Http\Resources\AuthorCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $query = Author::query();

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = $request->get('per_page', 15);
        $authors = $query->paginate($perPage);

        return new AuthorCollection($authors);
    }

    public function store(StoreAuthorRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->uploadPhoto($request->file('photo'));
        }

        $author = Author::create($data);

        return response()->json(new AuthorResource($author), 201);
    }

    public function show($slug)
    {
        $author = Author::where('slug', $slug)->firstOrFail();
        return new AuthorResource($author);
    }

    public function showAdmin(Author $author)
    {
        return new AuthorResource($author);
    }

    public function update(UpdateAuthorRequest $request, Author $author): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($author->photo_path) {
                Storage::disk('public')->delete($author->photo_path);
            }
            $data['photo_path'] = $this->uploadPhoto($request->file('photo'));
        }

        $author->update($data);

        return response()->json(new AuthorResource($author));
    }

    public function destroy(Author $author): JsonResponse
    {
        $author->delete();
        return response()->json(['message' => 'Author deleted successfully']);
    }

    public function storePhoto(Request $request, Author $author): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|max:3072'
        ]);

        if ($author->photo_path) {
            Storage::disk('public')->delete($author->photo_path);
        }

        $photoPath = $this->uploadPhoto($request->file('photo'));
        $author->update(['photo_path' => $photoPath]);

        return response()->json([
            'photo_url' => $author->photo_url,
            'message' => 'Photo uploaded successfully'
        ]);
    }

    public function deletePhoto(Author $author): JsonResponse
    {
        if ($author->photo_path) {
            Storage::disk('public')->delete($author->photo_path);
            $author->update(['photo_path' => null]);
        }

        return response()->json(['message' => 'Photo deleted successfully']);
    }

    private function uploadPhoto($file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('authors', $filename, 'public');
    }
}
