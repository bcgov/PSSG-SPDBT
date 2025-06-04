using System.Linq.Expressions;

namespace Spd.Utilities.Shared.Tools;
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> BuildOrPredicate<T, TValue>(string propertyName, IEnumerable<TValue> values)
    {
        var parameter = Expression.Parameter(typeof(T), "e");
        Expression? predicate = null;

        foreach (var value in values)
        {
            var left = Expression.PropertyOrField(parameter, propertyName);
            var right = Expression.Constant(value, typeof(TValue));
            var equals = Expression.Equal(left, right);

            predicate = predicate == null ? equals : Expression.OrElse(predicate, equals);
        }

        return predicate == null
            ? e => false // no values provided
            : Expression.Lambda<Func<T, bool>>(predicate, parameter);
    }
}

