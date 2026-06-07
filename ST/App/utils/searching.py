# App/utils/searching.py

class SearchingAlgorithms:

    @staticmethod
    def binary_search(products, target, key='Pname'):
        """
        Binary Search on sorted list by product name
        Requires products sorted by Pname
        """
        left, right = 0, len(products) - 1

        while left <= right:
            mid = (left + right) // 2
            current = getattr(products[mid], key)

            if current == target:
                return products[mid]
            elif current < target:
                left = mid + 1
            else:
                right = mid - 1

        return None

    @staticmethod
    def jump_search(products, target, key='Pname'):
        """
        Jump Search implementation
        """
        import math
        n = len(products)
        step = int(math.sqrt(n))
        prev = 0

        while getattr(products[min(step, n) - 1], key) < target:
            prev = step
            step += int(math.sqrt(n))
            if prev >= n:
                return None

        for i in range(prev, min(step, n)):
            if getattr(products[i], key) == target:
                return products[i]

        return None
