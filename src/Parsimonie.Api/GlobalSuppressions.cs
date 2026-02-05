// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

// Suppress LoggerMessage performance warning - acceptable trade-off for readability in this project size
// When the project scales to high-throughput scenarios, consider implementing LoggerMessage delegates
[assembly: SuppressMessage(
    "Performance",
    "CA1848:Use the LoggerMessage delegates",
    Justification = "Acceptable trade-off for code readability at current project scale")]

// Suppress static members on generic types - ServiceResult<T> factory methods are idiomatic
[assembly: SuppressMessage(
    "Design",
    "CA1000:Do not declare static members on generic types",
    Justification = "ServiceResult<T> factory pattern is idiomatic and improves usability")]

// Suppress constant array warnings in EF Core migrations - these are auto-generated
[assembly: SuppressMessage(
    "Performance",
    "CA1861:Prefer 'static readonly' fields over constant array arguments",
    Scope = "namespaceanddescendants",
    Target = "~N:Parsimonie.Api.Migrations",
    Justification = "EF Core migration files are auto-generated")]
