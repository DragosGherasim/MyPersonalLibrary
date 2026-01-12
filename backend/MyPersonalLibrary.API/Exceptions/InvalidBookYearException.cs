namespace MyPersonalLibrary.API.Exceptions;

public class InvalidBookYearException(int year)
    : Exception($"Invalid year: {year}. Year cannot be greater than 2026.")
{
    public string Code => "BOOK_INVALID_YEAR";
}
