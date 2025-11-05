<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\PurchaseType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PurchaseTypeController extends Controller
{
    /**
     * Get all purchase types for a book.
     */
    public function index(Book $book): JsonResponse
    {
        $purchaseTypes = $book->purchaseTypes()->get();

        return response()->json([
            'success' => true,
            'data' => $purchaseTypes,
        ]);
    }

    /**
     * Get only active purchase types for a book (public).
     */
    public function active(Book $book): JsonResponse
    {
        $purchaseTypes = $book->activePurchaseTypes()->get();

        return response()->json([
            'success' => true,
            'data' => $purchaseTypes,
        ]);
    }

    /**
     * Store a new purchase type.
     */
    public function store(Request $request, Book $book): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:unique,pack,corporate',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'min_quantity' => 'required|integer|min:1',
            'max_quantity' => 'nullable|integer|min:1',
            'price_cfa' => 'required|integer|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        $validated['book_id'] = $book->id;

        $purchaseType = PurchaseType::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type d\'achat créé avec succès',
            'data' => $purchaseType,
        ], 201);
    }

    /**
     * Update a purchase type.
     */
    public function update(Request $request, Book $book, PurchaseType $purchaseType): JsonResponse
    {
        // Verify the purchase type belongs to the book
        if ($purchaseType->book_id !== $book->id) {
            return response()->json([
                'success' => false,
                'message' => 'Type d\'achat non trouvé pour ce livre',
            ], 404);
        }

        $validated = $request->validate([
            'type' => 'sometimes|in:unique,pack,corporate',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'min_quantity' => 'sometimes|integer|min:1',
            'max_quantity' => 'nullable|integer|min:1',
            'price_cfa' => 'sometimes|integer|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        $purchaseType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type d\'achat mis à jour avec succès',
            'data' => $purchaseType->fresh(),
        ]);
    }

    /**
     * Delete a purchase type.
     */
    public function destroy(Book $book, PurchaseType $purchaseType): JsonResponse
    {
        // Verify the purchase type belongs to the book
        if ($purchaseType->book_id !== $book->id) {
            return response()->json([
                'success' => false,
                'message' => 'Type d\'achat non trouvé pour ce livre',
            ], 404);
        }

        $purchaseType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Type d\'achat supprimé avec succès',
        ]);
    }
}
